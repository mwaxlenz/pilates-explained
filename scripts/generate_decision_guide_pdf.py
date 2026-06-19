from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable,
    FrameBreak,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "downloads" / "pilates-starter-decision-guide.pdf"
MIRROR = ROOT / "output" / "pdf" / "pilates-starter-decision-guide.pdf"

TEAL = colors.HexColor("#1A7A6D")
TEAL_LIGHT = colors.HexColor("#E8F4F2")
DARK = colors.HexColor("#2C2C2C")
PAPER = colors.HexColor("#FAF5F0")
PAPER_DARK = colors.HexColor("#F0E8DD")
CLAY = colors.HexColor("#8B6914")
CLAY_LIGHT = colors.HexColor("#F5EDD6")
WARM_GRAY = colors.HexColor("#6B6155")
BORDER = colors.HexColor("#D4C9BE")
GREEN = colors.HexColor("#3D8B6E")
GREEN_LIGHT = colors.HexColor("#E5F2EC")
RED = colors.HexColor("#C45B4D")
RED_LIGHT = colors.HexColor("#FBEAE8")
WHITE = colors.white


def register_fonts():
    georgia = "/System/Library/Fonts/Supplemental/Georgia.ttf"
    georgia_bold = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
    if Path(georgia).exists():
        pdfmetrics.registerFont(TTFont("Georgia", georgia))
    if Path(georgia_bold).exists():
        pdfmetrics.registerFont(TTFont("Georgia-Bold", georgia_bold))


class Rule(Flowable):
    def __init__(self, color=TEAL, width=1.8 * inch, height=2):
        super().__init__()
        self.color = color
        self.width = width
        self.height = height

    def wrap(self, availWidth, availHeight):
        return self.width, self.height + 8

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.height)
        self.canv.line(0, 4, self.width, 4)


class CoverMark(Flowable):
    def __init__(self):
        super().__init__()
        self.width = 1.05 * inch
        self.height = 1.05 * inch

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        cx = self.width / 2
        cy = self.height / 2
        scale = self.width / 160
        c.setFillColor(PAPER)
        c.circle(cx, cy, self.width / 2, fill=1, stroke=0)
        c.setStrokeColor(TEAL)
        c.setLineWidth(7 * scale)
        c.circle(cx, cy, 69 * scale, fill=0, stroke=1)
        c.setStrokeColor(BORDER)
        c.setLineWidth(3 * scale)
        c.circle(cx, cy, 53 * scale, fill=0, stroke=1)
        c.setLineCap(1)
        c.setStrokeColor(DARK)
        c.setLineWidth(6 * scale)
        c.line(33 * scale, 59 * scale, 127 * scale, 59 * scale)
        c.setFillColor(CLAY)
        c.roundRect(47 * scale, 67 * scale, 52 * scale, 17 * scale, 3 * scale, fill=1, stroke=0)
        c.setStrokeColor(DARK)
        c.setLineWidth(4 * scale)
        p = c.beginPath()
        p.moveTo(42 * scale, 84 * scale)
        p.lineTo(42 * scale, 107 * scale)
        p.moveTo(96 * scale, 84 * scale)
        p.lineTo(96 * scale, 107 * scale)
        p.moveTo(41 * scale, 107 * scale)
        p.lineTo(98 * scale, 107 * scale)
        c.drawPath(p, stroke=1, fill=0)
        c.setFillColor(WHITE)
        c.setStrokeColor(CLAY)
        c.setLineWidth(3 * scale)
        p = c.beginPath()
        p.moveTo(59 * scale, 103 * scale)
        p.curveTo(68 * scale, 111 * scale, 78 * scale, 111 * scale, 89 * scale, 103 * scale)
        p.lineTo(89 * scale, 78 * scale)
        p.curveTo(78 * scale, 85 * scale, 68 * scale, 85 * scale, 59 * scale, 78 * scale)
        p.close()
        c.drawPath(p, stroke=1, fill=1)
        p = c.beginPath()
        p.moveTo(89 * scale, 103 * scale)
        p.curveTo(100 * scale, 111 * scale, 110 * scale, 111 * scale, 119 * scale, 103 * scale)
        p.lineTo(119 * scale, 78 * scale)
        p.curveTo(108 * scale, 85 * scale, 98 * scale, 85 * scale, 89 * scale, 78 * scale)
        p.close()
        c.drawPath(p, stroke=1, fill=1)
        c.setStrokeColor(TEAL)
        c.setLineWidth(5 * scale)
        p = c.beginPath()
        p.moveTo(45 * scale, 41 * scale)
        p.curveTo(69 * scale, 58 * scale, 91 * scale, 58 * scale, 115 * scale, 41 * scale)
        c.drawPath(p, stroke=1, fill=0)
        c.setFillColor(PAPER)
        c.setStrokeColor(DARK)
        c.setLineWidth(3 * scale)
        c.circle(45 * scale, 59 * scale, 5 * scale, fill=1, stroke=1)
        c.circle(115 * scale, 59 * scale, 5 * scale, fill=1, stroke=1)


def styles():
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "kicker",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11,
            textColor=CLAY,
            spaceAfter=8,
            uppercase=True,
        ),
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="Georgia-Bold",
            fontSize=34,
            leading=39,
            textColor=DARK,
            spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=13,
            leading=19,
            textColor=WARM_GRAY,
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Georgia-Bold",
            fontSize=22,
            leading=27,
            textColor=DARK,
            spaceBefore=4,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Georgia-Bold",
            fontSize=15,
            leading=20,
            textColor=TEAL,
            spaceBefore=10,
            spaceAfter=5,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=base["Heading3"],
            fontName="Georgia-Bold",
            fontSize=12.5,
            leading=16,
            textColor=DARK,
            spaceBefore=7,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.4,
            leading=13.5,
            textColor=DARK,
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=11,
            textColor=WARM_GRAY,
        ),
        "note": ParagraphStyle(
            "note",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=12,
            textColor=DARK,
            backColor=TEAL_LIGHT,
            borderColor=BORDER,
            borderWidth=0.6,
            borderPadding=8,
            spaceBefore=8,
            spaceAfter=10,
        ),
        "table": ParagraphStyle(
            "table",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7.7,
            leading=10,
            textColor=DARK,
        ),
        "table_head": ParagraphStyle(
            "table_head",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=7.8,
            leading=10,
            textColor=WHITE,
            alignment=TA_CENTER,
        ),
        "toc_num": ParagraphStyle(
            "toc_num",
            parent=base["BodyText"],
            fontName="Georgia-Bold",
            fontSize=16,
            leading=18,
            textColor=TEAL,
            alignment=TA_CENTER,
        ),
    }


def P(text, style):
    return Paragraph(text, style)


def bullets(items, s):
    return ListFlowable(
        [ListItem(P(item, s["body"]), leftIndent=10) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=14,
        bulletFontName="Helvetica",
        bulletFontSize=7,
        bulletColor=TEAL,
    )


def inline_bullets(items):
    return "<br/>".join([f"- {item}" for item in items])


def number_card(num, title, desc, s):
    return Table(
        [[P(str(num), s["toc_num"]), P(f"<b>{title}</b><br/>{desc}", s["body"])]],
        colWidths=[0.45 * inch, 5.7 * inch],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.6, BORDER),
                ("LINEBEFORE", (1, 0), (1, 0), 2, TEAL),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        ),
    )


def page_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(0.72 * inch, 0.55 * inch, 7.78 * inch, 0.55 * inch)
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(WARM_GRAY)
    canvas.drawString(0.72 * inch, 0.36 * inch, "pilatesexplained.com")
    canvas.drawRightString(7.78 * inch, 0.36 * inch, f"Page {doc.page}")
    canvas.restoreState()


def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)
    canvas.setFillColor(TEAL_LIGHT)
    canvas.rect(0, 0, letter[0], 2.2 * inch, fill=1, stroke=0)
    canvas.setFillColor(CLAY_LIGHT)
    canvas.rect(5.6 * inch, 0, 2.9 * inch, letter[1], fill=1, stroke=0)
    canvas.setStrokeColor(TEAL)
    canvas.setLineWidth(4)
    canvas.line(0.72 * inch, 1.95 * inch, 4.2 * inch, 1.95 * inch)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(WARM_GRAY)
    canvas.drawString(0.72 * inch, 0.36 * inch, "pilatesexplained.com - History, equipment, and beginner guides")
    canvas.restoreState()


def styled_table(rows, widths, header=True):
    data = []
    for row in rows:
        data.append([P(str(cell), style) for cell, style in row])
    commands = [
        ("BOX", (0, 0), (-1, -1), 0.6, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    if header:
        commands += [
            ("BACKGROUND", (0, 0), (-1, 0), TEAL),
            ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ]
    return Table(data, colWidths=widths, repeatRows=1 if header else 0, style=TableStyle(commands))


def build():
    register_fonts()
    s = styles()
    story = []

    story += [
        CoverMark(),
        Spacer(1, 0.45 * inch),
        P("A FREE GUIDE FROM PILATES EXPLAINED", s["kicker"]),
        P("The Pilates<br/>Starter Decision Guide", s["title"]),
        P("Choose your first Pilates path with confidence: mat, Reformer, online, or studio.", s["subtitle"]),
        Rule(),
        P("In 10 minutes, you will understand:", s["h2"]),
        bullets(
            [
                "The four most common ways to start Pilates.",
                "What each path is best for and what it usually costs.",
                "What to ask before booking a first class.",
                "A clear next step you can take today, without overcommitting.",
            ],
            s,
        ),
        Spacer(1, 2.2 * inch),
        P("Updated May 2026", s["small"]),
        PageBreak(),
    ]

    story += [
        P("What Is Inside", s["h1"]),
        Rule(),
        number_card(1, "Quick self-diagnosis", "What are you actually trying to solve?", s),
        Spacer(1, 0.08 * inch),
        number_card(2, "The four starting paths", "Mat, Reformer, online, and studio compared.", s),
        Spacer(1, 0.08 * inch),
        number_card(3, "The decision matrix", "Match your situation to a sensible starting point.", s),
        Spacer(1, 0.08 * inch),
        number_card(4, "Cost expectations", "What you will actually pay, including regional differences.", s),
        Spacer(1, 0.08 * inch),
        number_card(5, "What to ask before booking", "The questions that separate thoughtful instruction from guesswork.", s),
        Spacer(1, 0.08 * inch),
        number_card(6, "Red flags and good signs", "How to spot quality, and when to keep looking.", s),
        Spacer(1, 0.08 * inch),
        number_card(7, "Your first class checklist", "A print-friendly checklist for the day of class.", s),
        P(
            "This guide is educational and does not provide medical advice. If you have pain, injuries, health conditions, are pregnant or postpartum, or are unsure whether Pilates is appropriate for you, consult a qualified health professional and choose an instructor who can adapt exercises to your needs.",
            s["note"],
        ),
        PageBreak(),
    ]

    diagnosis = [
        ("Posture, stiffness, or body support", "You sit at a desk most of the day, feel stiff, or want strength without strain.", "Beginner studio class or Reformer intro, where an instructor can observe alignment."),
        ("Strength without high impact", "You want to get stronger, but running, jumping, or heavy lifting does not appeal to you.", "Any path can work. Mat and Reformer both build functional strength."),
        ("Flexibility and mobility", "You feel tight or limited and want to move more freely.", "Mat Pilates or online classes with a flexibility focus."),
        ("Stress relief and mind-body connection", "You want something focused, slower, and calming.", "Studio class for guided support, or online for home convenience."),
        ("Extra support or modifications", "You are returning to exercise, managing a condition, or need exercise adapted to your body.", "Private introductory session or small beginner class with a comprehensively trained instructor."),
    ]
    story += [P("1. Quick Self-Diagnosis", s["h1"]), Rule()]
    for title, body, rec in diagnosis:
        story += [KeepTogether([P(title, s["h3"]), P(body, s["body"]), P(f"<b>Best starting path:</b> {rec}", s["body"])])]
    story += [PageBreak()]

    rows = [
        [(x, s["table_head"]) for x in ["Path", "Best for", "Typical cost", "Watch out for"]],
        [(x, s["table"]) for x in ["Mat Pilates", "Budget-conscious beginners, home practice, and building a foundation.", "$0-$35 per class", "Can feel harder than expected; no equipment feedback for form."]],
        [(x, s["table"]) for x in ["Reformer Pilates", "People who want guided resistance, equipment feedback, and a studio setting.", "$25-$85 per group class", "Higher cost; studio quality and class size matter."]],
        [(x, s["table"]) for x in ["Online Pilates", "Self-motivated people, tight schedules, and low-commitment exploration.", "$0-$30 per month", "No real-time correction; beginner quality varies widely."]],
        [(x, s["table"]) for x in ["Private or small studio", "The highest-quality start, extra support, modifications, or in-person guidance.", "$50-$150+ per session", "Highest cost; quality depends on instructor training."]],
    ]
    story += [
        P("2. The Four Starting Paths", s["h1"]),
        Rule(),
        P("There is no single right way to start Pilates. The best choice depends on your budget, confidence level, physical needs, and lifestyle.", s["body"]),
        styled_table(rows, [1.05 * inch, 2.15 * inch, 1.2 * inch, 1.95 * inch]),
        Spacer(1, 0.15 * inch),
        P("The practical rule: choose the format you can repeat safely. Consistency matters more than finding the most impressive-sounding class.", s["note"]),
        PageBreak(),
    ]

    matrix = [
        ("I want the lowest-cost option.", "Start with mat or online."),
        ("I need guidance and accountability.", "Book a studio beginner class or Reformer intro."),
        ("I am nervous about my first class.", "Book a beginner studio class or private intro session."),
        ("I need extra form support.", "Choose a small beginner class or private intro."),
        ("I have pain, an injury, or a condition.", "Ask a health professional first, then find a credentialed instructor."),
        ("I want to build a lasting habit.", "Combine an online subscription with one weekly studio class."),
        ("I want strength and toning results.", "Choose the format you will attend consistently."),
        ("I am choosing between Pilates and yoga.", "Try one beginner class of each, then decide."),
        ("I do not know what I want yet.", "Try a free online beginner class first."),
    ]
    matrix_rows = [[(x, s["table_head"]) for x in ["If this sounds like you", "Start here"]]]
    matrix_rows += [[(a, s["table"]), (b, s["table"])] for a, b in matrix]
    story += [
        P("3. The Decision Matrix", s["h1"]),
        Rule(),
        styled_table(matrix_rows, [3.3 * inch, 3.05 * inch]),
        Spacer(1, 0.18 * inch),
        P("Not sure which category fits? Start with a free online beginner class. It costs nothing, takes 20-30 minutes, and gives you enough experience to know whether Pilates is worth exploring further.", s["note"]),
        PageBreak(),
    ]

    cost_rows = [
        [(x, s["table_head"]) for x in ["Format", "Entry cost", "Monthly range", "What you get"]],
        [(x, s["table"]) for x in ["Online subscription", "$0-$20/mo", "$0-$30/mo", "Large library, flexible schedule, no form correction."]],
        [(x, s["table"]) for x in ["Mat group class", "$10-$35/class", "$40-$140/mo", "Instructor-led, community setting, minimal equipment."]],
        [(x, s["table"]) for x in ["Reformer group class", "$25-$85/class", "$100-$340/mo", "Equipment-guided resistance, smaller classes typical."]],
        [(x, s["table"]) for x in ["Private instruction", "$50-$150+", "$200-$600/mo", "One-on-one attention and tailored modifications."]],
    ]
    region_rows = [
        [(x, s["table_head"]) for x in ["Region", "Mat group", "Reformer group", "Private session"]],
        [(x, s["table"]) for x in ["Major metro", "$30-$55", "$45-$95", "$80-$150+"]],
        [(x, s["table"]) for x in ["Mid-size city", "$20-$40", "$35-$75", "$65-$110"]],
        [(x, s["table"]) for x in ["Smaller city", "$10-$30", "$25-$60", "$50-$85"]],
    ]
    story += [
        P("4. Cost Expectations", s["h1"]),
        Rule(),
        styled_table(cost_rows, [1.55 * inch, 1.05 * inch, 1.15 * inch, 2.6 * inch]),
        Spacer(1, 0.2 * inch),
        P("Prices Vary by Region", s["h2"]),
        styled_table(region_rows, [1.55 * inch, 1.6 * inch, 1.6 * inch, 1.6 * inch]),
        P("Treat these as typical ranges, not guarantees. Many studios offer a discounted introductory package. Ask before booking at full price.", s["small"]),
        PageBreak(),
    ]

    questions = [
        ("Is this class suitable for complete beginners?", "If there is no beginner-specific class, ask whether the instructor offers modifications and is experienced with new students."),
        ("How many people are in the class?", "Smaller classes mean more individual attention, especially for Reformer work."),
        ("Is it mat-based or Reformer-based?", "These are different experiences. Make sure you know which one you are signing up for."),
        ("What training does the instructor have?", "Look for comprehensive training and a clear explanation of teaching background."),
        ("Will the instructor ask about injuries or limitations?", "A good instructor will ask before you begin and offer alternatives throughout."),
        ("Is there an intro package or first-class discount?", "Lower your risk while you evaluate the fit."),
        ("What should I wear and bring?", "Most classes require fitted, comfortable clothing. Reformer studios often require grip socks."),
    ]
    story += [P("5. What to Ask Before Booking", s["h1"]), Rule()]
    for title, body in questions:
        story += [KeepTogether([P(title, s["h3"]), P(body, s["body"])])]
    story += [PageBreak()]

    red_flags = [
        "No beginner pathway or introductory option.",
        "Pain is dismissed as normal or part of the process.",
        "No modifications are offered for different levels or limitations.",
        "Class level is unclear before booking.",
        "Instructor cannot explain mat versus Reformer.",
        "Studio pressures you into a long-term contract before your first class.",
    ]
    good_signs = [
        "Specific beginner class or introductory session.",
        "Instructor asks about health history before you start.",
        "Modifications are offered naturally.",
        "Class size is small enough for individual attention.",
        "Instructor can explain training background and credentials.",
        "You feel welcome asking questions.",
    ]
    story += [
        P("6. Red Flags and Good Signs", s["h1"]),
        Rule(),
        styled_table(
            [
                [(x, s["table_head"]) for x in ["Pause before booking", "Good signs"]],
                [(inline_bullets(red_flags), s["table"]), (inline_bullets(good_signs), s["table"])],
            ],
            [3.1 * inch, 3.1 * inch],
        ),
        PageBreak(),
    ]

    story += [
        P("7. Your Recommended First Step", s["h1"]),
        Rule(),
        P("<b>If you are healthy and budget-conscious:</b> Try a reputable free beginner class online from an established instructor or platform. Do one class. Notice how you feel afterward. That is your data point.", s["body"]),
        P("<b>If you are nervous or unsure:</b> Book a beginner studio class or a single private introductory session. Tell the instructor it is your first time.", s["body"]),
        P("<b>If you have a health condition, injury, or are pregnant/postpartum:</b> Check with a qualified health professional first. Then book a private session or small beginner class with an instructor who is comfortable offering modifications.", s["body"]),
        P("<b>If you are deciding between Pilates and yoga:</b> Try one beginner class of each within the same week, then decide which felt more aligned with what your body needs right now.", s["body"]),
        P("The goal is not a perfect plan. It is one clear first experience.", s["note"]),
        PageBreak(),
    ]

    checklist = [
        ("Before You Go", ["Confirmed the class is beginner-friendly.", "Asked about class size and what to expect.", "Mentioned any health conditions or limitations when booking.", "Checked what to wear and whether grip socks are required.", "Arrived 10-15 minutes early."]),
        ("During Class", ["Told the instructor it is your first Pilates class.", "Positioned yourself where you can see the instructor clearly.", "Focused on breathing and control, not speed.", "Asked for help if something felt wrong.", "Moved within a safe range of motion."]),
        ("After Class", ["Noticed how your body felt. Mild soreness can be normal; sharp pain is not.", "Asked the instructor any follow-up questions.", "Decided whether to try two or three sessions before judging.", "Booked the next class while the motivation is fresh."]),
    ]
    story += [P("Your First Class Checklist", s["h1"]), Rule()]
    for title, items in checklist:
        story += [P(title, s["h2"]), bullets(items, s)]
    story += [
        P("The first class is the hardest because everything is unfamiliar. By the third class, the language, equipment, and rhythm usually start to make sense.", s["note"]),
        PageBreak(),
    ]

    story += [
        P("Keep Learning", s["h1"]),
        Rule(),
        P("This guide gave you the map. Pilates rewards consistency more than intensity, and curiosity more than perfection. Whatever path you choose - mat, Reformer, online, or studio - make the first step small enough that you can actually take it.", s["body"]),
        P("Continue with Pilates Explained", s["h2"]),
        bullets(
            [
                "What Is Contrology? The original name and philosophy behind Pilates.",
                "Classical vs Modern Pilates: what the difference means for beginners.",
                "History of the Reformer: how spring resistance became iconic.",
                "What Is Lagree? Why Lagree is adjacent to Pilates, not a Pilates lineage.",
                "Short video summaries on the site and YouTube channel.",
            ],
            s,
        ),
        Spacer(1, 0.2 * inch),
        P("pilatesexplained.com", ParagraphStyle("url", parent=s["h1"], textColor=TEAL, alignment=TA_CENTER)),
        P("History, equipment, and beginner guides", ParagraphStyle("tag", parent=s["small"], alignment=TA_CENTER)),
    ]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    MIRROR.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        rightMargin=0.72 * inch,
        leftMargin=0.72 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.78 * inch,
        title="The Pilates Starter Decision Guide",
        author="Pilates Explained",
        subject="Beginner guide to choosing a Pilates starting path",
    )
    doc.build(story, onFirstPage=cover_bg, onLaterPages=page_bg)
    MIRROR.write_bytes(OUT.read_bytes())
    print(OUT)
    print(MIRROR)


if __name__ == "__main__":
    build()
