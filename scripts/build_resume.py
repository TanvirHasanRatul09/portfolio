from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Tanvir-Hasan-Ratul-Resume.pdf"
PUBLIC = ROOT / "public" / "Tanvir-Hasan-Ratul-Resume.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

pdfmetrics.registerFont(TTFont("ArialNarrow", r"C:\Windows\Fonts\ARIALN.TTF"))
pdfmetrics.registerFont(TTFont("ArialNarrow-Bold", r"C:\Windows\Fonts\ARIALNB.TTF"))
pdfmetrics.registerFont(TTFont("ArialNarrow-Italic", r"C:\Windows\Fonts\ARIALNI.TTF"))
pdfmetrics.registerFontFamily("ArialNarrow", normal="ArialNarrow", bold="ArialNarrow-Bold", italic="ArialNarrow-Italic")

NAVY = colors.HexColor("#12345B")
INK = colors.HexColor("#111111")
styles = getSampleStyleSheet()
name_style = ParagraphStyle("Name", parent=styles["Title"], fontName="ArialNarrow-Bold", fontSize=25, leading=25.5, alignment=TA_CENTER, textColor=INK, spaceAfter=3.5)
contact_style = ParagraphStyle("Contact", parent=styles["BodyText"], fontName="ArialNarrow", fontSize=10, leading=11.5, alignment=TA_CENTER, textColor=INK, spaceAfter=5.5)
section_style = ParagraphStyle("Section", parent=styles["Heading2"], fontName="ArialNarrow-Bold", fontSize=10.9, leading=11.5, textColor=NAVY, spaceBefore=5, spaceAfter=2)
body_style = ParagraphStyle("Body", parent=styles["BodyText"], fontName="ArialNarrow", fontSize=9.7, leading=10.5, textColor=INK, spaceAfter=1.5)
bullet_style = ParagraphStyle("Bullet", parent=body_style, fontSize=9.3, leading=10.2, leftIndent=11, firstLineIndent=-8, spaceAfter=0.7)
project_title_style = ParagraphStyle("ProjectTitle", parent=body_style, fontName="ArialNarrow-Bold", fontSize=9.9, leading=10.5, spaceBefore=2.2, spaceAfter=0.9)


def section(title):
    return KeepTogether([
        Paragraph(title.upper(), section_style),
        Table([[""]], colWidths=[7.66 * inch], rowHeights=[0.6], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), NAVY)])),
        Spacer(1, 1.1),
    ])


def project(title, stack, bullets):
    content = [Paragraph(f"{title}  <font name='ArialNarrow-Italic' color='#3D4148'>/ {stack}</font>", project_title_style)]
    content.extend(Paragraph(f"- {item}", bullet_style) for item in bullets)
    return KeepTogether(content)


doc = SimpleDocTemplate(
    str(OUTPUT), pagesize=letter, leftMargin=0.4 * inch, rightMargin=0.4 * inch,
    topMargin=0.3 * inch, bottomMargin=0.28 * inch,
    title="Tanvir Hasan Ratul - Resume", author="Tanvir Hasan Ratul",
)

story = [
    Paragraph("TANVIR HASAN RATUL", name_style),
    Paragraph(
        "Narayanganj, Dhaka, Bangladesh &nbsp;|&nbsp; 01608776259 &nbsp;|&nbsp; "
        "<link href='mailto:tanvirhasan58p@gmail.com' color='#315FC4'>tanvirhasan58p@gmail.com</link><br/>"
        "<link href='https://www.linkedin.com/in/tanvir-hasan-595b9a2b0/' color='#315FC4'>LinkedIn</link> &nbsp;|&nbsp; "
        "<link href='https://github.com/TanvirHasanRatul09' color='#315FC4'>GitHub</link> &nbsp;|&nbsp; "
        "<link href='https://leetcode.com/u/Destro69/' color='#315FC4'>LeetCode</link>", contact_style,
    ),
    section("Objective"),
    Paragraph("Computer Science undergraduate seeking a Software Engineering or Backend Developer internship. Experienced building FastAPI backends, relational systems, REST APIs, and offline-capable React applications; comfortable with SQL, object-oriented programming, authentication, testing, and data tools.", body_style),
    section("Education"),
    Table([
        [Paragraph("<b>Ahsanullah University of Science and Technology (AUST)</b><br/>B.Sc. in Computer Science and Engineering", body_style), Paragraph("3rd Year, 2nd Semester<br/><b>CGPA: 3.223 / 4.00</b>", body_style)],
        [Paragraph("<b>St. Joseph Higher Secondary School & College</b><br/>Higher Secondary Certificate", body_style), Paragraph("<b>GPA: 5.00 / 5.00</b>", body_style)],
        [Paragraph("<b>Narayanganj Ideal School</b><br/>Secondary School Certificate", body_style), Paragraph("<b>GPA: 5.00 / 5.00</b>", body_style)],
    ], colWidths=[5.93 * inch, 1.73 * inch], style=TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ])),
    section("Technical Skills"),
    Paragraph("<b>Languages & Frontend:</b> Python, TypeScript, SQL, C++, React, Vite, PWA", body_style),
    Paragraph("<b>Backend & APIs:</b> FastAPI, REST APIs, PostgreSQL, SQLAlchemy, SQLite, SQL Server, Google OAuth", body_style),
    Paragraph("<b>Data & Tools:</b> Pandas, Streamlit, Power BI, Power Query, Excel, Docker, Git/GitHub", body_style),
    Paragraph("<b>Engineering:</b> Object-Oriented Programming, Data Structures & Algorithms, Pytest, Vitest, Playwright", body_style),
    section("Projects"),
    project("Academic Assistant", "React, TypeScript, FastAPI, PostgreSQL, Google Classroom, PWA", [
        "<b>Purpose:</b> Give students one reliable place to review course tasks, deadlines, exams, notices, and completion status without modifying original Google Classroom content.",
        "Built a responsive PWA with browser-local dashboard snapshots, limited offline search, and queued state changes with conflict handling.",
        "Developed a FastAPI/PostgreSQL backend with Google OAuth, encrypted tokens, read-only Classroom synchronization, deterministic course matching, and optional Gemini explanations.",
        "Added server-side sessions, CSRF protection, user-scoped queries, migrations, and automated backend, frontend, and end-to-end tests.",
    ]),
    project("Internship Application Tracker", "Python, SQL Server, pyodbc, OOP", [
        "<b>Purpose:</b> Centralize internship applications, companies, interviews, and progress so students can track their job-search pipeline consistently.",
        "Designed a normalized Student, Company, Application, and Interview schema with a reusable Python data-access layer.",
        "Implemented CRUD workflows, SQL LIKE keyword search, exception handling, and aggregated application-status reports.",
        "Used object-oriented modules to keep database operations and reporting maintainable and reusable.",
    ]),
    project("Weather Dashboard", "Python, REST API, Pandas, Streamlit", [
        "<b>Purpose:</b> Turn live weather data into a simple decision-support view for current conditions, next-day forecasts, and previous searches.",
        "Integrated OpenWeatherMap data and calculated forecast minimum, maximum, and average temperatures with a trend chart.",
        "Used Pandas and CSV persistence to record searches and support filtering by city and date.",
        "Presented API responses through an interactive Streamlit interface with clear weather and forecast summaries.",
    ]),
    project("Football Player Performance Dashboard", "SQL Server, Power Query, Power BI, Excel", [
        "<b>Purpose:</b> Transform raw football data into an interactive report for comparing performance, contributions, young talent, and future potential.",
        "Cleaned and transformed a Kaggle dataset with T-SQL, then modeled relationships and calculated fields in Power BI.",
        "Delivered four report pages with filters for nation, position, age, market value, goals, assists, and projections.",
        "Used Power Query and dashboard KPIs to make player comparisons and performance trends easier to explore.",
    ]),
    section("Leadership, Achievements & Certifications"),
    Table([
        [Paragraph("<b>Leadership</b>", body_style), Paragraph("Deputy Coordinator, Department of Publication - AUST PIC; Member, Josephite Math Club", body_style)],
        [Paragraph("<b>Achievement</b>", body_style), Paragraph("GP FutureMakers 2026 - Advanced to Round 2 as one of 118 teams selected from 1,130 participating teams", body_style)],
        [Paragraph("<b>Certifications</b>", body_style), Paragraph("Google Prompting Essentials Specialization - Coursera; Data Analytics - Excel, Power BI, Python & SQL - Tutorials Point Bangladesh", body_style)],
    ], colWidths=[0.88 * inch, 6.78 * inch], style=TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 0.35), ("BOTTOMPADDING", (0, 0), (-1, -1), 0.35),
    ])),
]

doc.build(story)
PUBLIC.write_bytes(OUTPUT.read_bytes())
print(OUTPUT)
