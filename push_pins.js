#!/usr/bin/env node
/*
 * Pinterest organic launch pusher for Pilates Explained.
 *
 * Live writes require Pinterest API v5 Standard access, a Pinterest business account,
 * and process.env.PINTEREST_TOKEN. By default this script is DRY-RUN only and will
 * not create boards or pins unless --live is passed.
 */

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const API_BASE = "https://api.pinterest.com/v5";
const SITE_BASE = (process.env.PINTEREST_SITE_BASE || "https://pilatesexplained.com").replace(/\/$/, "");
const DEFAULT_MANIFEST = "pins_manifest.csv";
const DEFAULT_STATE = ".pinterest-pins-state.json";

function parseArgs(argv) {
  const args = {
    live: false,
    manifest: DEFAULT_MANIFEST,
    state: DEFAULT_STATE,
    limit: 0,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--live") args.live = true;
    else if (arg === "--manifest") args.manifest = argv[++i];
    else if (arg === "--state") args.state = argv[++i];
    else if (arg === "--limit") args.limit = Number(argv[++i] || 0);
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node push_pins.js [options]

Options:
  --live              Create boards and pins. Without this flag, runs as DRY-RUN.
  --manifest <path>   CSV path. Default: ${DEFAULT_MANIFEST}
  --state <path>      Local state file for created pin IDs. Default: ${DEFAULT_STATE}
  --limit <n>         Process only the first n manifest rows.

Environment:
  PINTEREST_TOKEN     Required for --live.
  PINTEREST_SITE_BASE Optional public base URL. Default: ${SITE_BASE}
`);
}

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...body] = rows.filter((candidate) => candidate.some((value) => value.trim()));
  if (!header) return [];

  return body.map((values) =>
    Object.fromEntries(header.map((column, index) => [column.trim(), (values[index] || "").trim()]))
  );
}

function loadManifest(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const rows = parseCsv(text);
  const required = [
    "board",
    "pin_title",
    "pin_description",
    "destination_url",
    "source_image_path",
    "color_token",
  ];

  for (const row of rows) {
    const missing = required.filter((column) => !row[column]);
    if (missing.length) {
      throw new Error(`Manifest row is missing required columns: ${missing.join(", ")}`);
    }
  }

  return rows;
}

function validateRow(row) {
  if (!["teal", "purple"].includes(row.color_token)) {
    throw new Error(`Invalid color_token "${row.color_token}" for "${row.pin_title}"`);
  }

  if (row.color_token === "purple" && row.board !== "Pilates Starter Guide") {
    throw new Error(`Purple is reserved for Guide/lead-magnet pins: "${row.pin_title}"`);
  }

  if (/#affiliate-link-pending|classpass/i.test(row.destination_url)) {
    throw new Error(`Blocked inactive class-finder or affiliate placeholder URL: ${row.destination_url}`);
  }
}

function imageUrl(sourceImagePath) {
  if (/^https?:\/\//i.test(sourceImagePath)) return sourceImagePath;
  const cleaned = sourceImagePath.replace(/^\.?\//, "");
  return `${SITE_BASE}/${cleaned}`;
}

function stableKey(row) {
  return crypto
    .createHash("sha256")
    .update([row.board, row.pin_title, row.destination_url, row.source_image_path].join("|"))
    .digest("hex")
    .slice(0, 16);
}

function loadState(filePath) {
  if (!fs.existsSync(filePath)) return { pins: {} };
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveState(filePath, state) {
  fs.writeFileSync(filePath, `${JSON.stringify(state, null, 2)}\n`);
}

async function pinterestRequest(pathname, options = {}) {
  const token = process.env.PINTEREST_TOKEN;
  if (!token) throw new Error("PINTEREST_TOKEN is required for live Pinterest API calls.");

  const response = await fetch(`${API_BASE}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`Pinterest API ${response.status} ${response.statusText}: ${text}`);
  }

  return data;
}

async function listAll(pathname) {
  const items = [];
  let bookmark = "";

  do {
    const separator = pathname.includes("?") ? "&" : "?";
    const page = await pinterestRequest(
      `${pathname}${separator}page_size=100${bookmark ? `&bookmark=${encodeURIComponent(bookmark)}` : ""}`
    );
    items.push(...(page.items || []));
    bookmark = page.bookmark || "";
  } while (bookmark);

  return items;
}

async function ensureBoards(rows, dryRun) {
  const boardNames = [...new Set(rows.map((row) => row.board))];
  const boardByName = new Map();

  if (!dryRun) {
    const boards = await listAll("/boards");
    for (const board of boards) {
      boardByName.set(board.name, board.id);
    }
  }

  for (const name of boardNames) {
    if (boardByName.has(name)) continue;

    if (dryRun) {
      console.log(`[dry-run] would create board: ${name}`);
      boardByName.set(name, `dry-run:${name}`);
    } else {
      const board = await pinterestRequest("/boards", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      console.log(`created board: ${name} (${board.id})`);
      boardByName.set(name, board.id);
    }
  }

  return boardByName;
}

async function loadExistingPins(boardByName, dryRun) {
  const existing = new Set();
  if (dryRun) return existing;

  for (const [boardName, boardId] of boardByName.entries()) {
    const pins = await listAll(`/boards/${boardId}/pins`);
    for (const pin of pins) {
      existing.add(`${boardName}|${pin.title || ""}|${pin.link || ""}`);
    }
  }

  return existing;
}

async function createPins(rows, boardByName, dryRun, statePath) {
  const state = loadState(statePath);
  const existing = await loadExistingPins(boardByName, dryRun);

  for (const row of rows) {
    const key = stableKey(row);
    const existingKey = `${row.board}|${row.pin_title}|${row.destination_url}`;

    if (state.pins[key] || existing.has(existingKey)) {
      console.log(`skip existing pin: ${row.pin_title}`);
      continue;
    }

    const payload = {
      board_id: boardByName.get(row.board),
      title: row.pin_title,
      description: row.pin_description,
      link: row.destination_url,
      media_source: {
        source_type: "image_url",
        url: imageUrl(row.source_image_path),
      },
    };

    if (dryRun) {
      console.log(`[dry-run] would create pin on "${row.board}": ${row.pin_title}`);
      continue;
    }

    const pin = await pinterestRequest("/pins", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    state.pins[key] = {
      pin_id: pin.id,
      board: row.board,
      title: row.pin_title,
      destination_url: row.destination_url,
      created_at: new Date().toISOString(),
    };
    saveState(statePath, state);
    console.log(`created pin: ${row.pin_title} (${pin.id})`);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const manifestPath = path.resolve(args.manifest);
  const statePath = path.resolve(args.state);
  const dryRun = !args.live;

  const rows = loadManifest(manifestPath);
  const selectedRows = args.limit > 0 ? rows.slice(0, args.limit) : rows;
  selectedRows.forEach(validateRow);

  console.log(`${dryRun ? "DRY-RUN" : "LIVE"} mode`);
  console.log(`manifest: ${manifestPath}`);
  console.log(`rows: ${selectedRows.length}`);

  if (!dryRun && !process.env.PINTEREST_TOKEN) {
    throw new Error("Set PINTEREST_TOKEN before running with --live.");
  }

  const boardByName = await ensureBoards(selectedRows, dryRun);
  await createPins(selectedRows, boardByName, dryRun, statePath);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
