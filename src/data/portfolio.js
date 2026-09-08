export const navigation = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Problem Solving', href: '#leetcode', id: 'leetcode' },
  { label: 'Credentials', href: '#certifications', id: 'certifications' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

export const education = [
  { school: 'Ahsanullah University of Science and Technology', detail: 'B.Sc. in Computer Science and Engineering', meta: '3rd Year, 2nd Semester · CGPA 3.23 / 4.00' },
  { school: 'St. Joseph Higher Secondary School & College', detail: 'Higher Secondary Certificate', meta: 'GPA 5.00 / 5.00' },
  { school: 'Narayanganj Ideal School', detail: 'Secondary School Certificate', meta: 'GPA 5.00 / 5.00' },
]

export const skills = [
  { title: 'Languages', items: ['Python', 'SQL', 'C++'] },
  { title: 'Backend & APIs', items: ['FastAPI', 'REST APIs', 'SQLite', 'SQL Server', 'pyodbc'] },
  { title: 'Data & Tools', items: ['Pandas', 'Streamlit', 'Power BI', 'Power Query', 'Excel', 'Git/GitHub'] },
  { title: 'Core CS', items: ['Object-Oriented Programming', 'Data Structures', 'Algorithms'] },
]

export const projects = [
  { title: 'Office Watch', description: 'A real-time office energy system built for the Techathon Nationals & Rover Summit preliminary round, with one FastAPI backend serving a live dashboard and a separate Discord bot.', details: ['Persisted devices, events, daily energy use, and alert history in a four-table SQLite layer.', 'Exposed shared REST and WebSocket interfaces with restart-safe after-hours and continuous-on alerts.'], technologies: ['Python', 'FastAPI', 'SQLite', 'WebSockets', 'JavaScript'], href: 'https://github.com/TanvirHasanRatul09/office_watch', featured: true },
  { title: 'Internship Application Tracker', description: 'A modular command-line application for managing students, companies, applications, and interviews through a relational SQL Server database.', details: ['Implemented CRUD workflows and database connectivity with Python and pyodbc.', 'Added keyword search, exception handling, and aggregated application-status reporting.'], technologies: ['Python', 'SQL Server', 'pyodbc', 'OOP'], href: 'https://github.com/TanvirHasanRatul09/Internship_Tracker', featured: true },
  { title: 'Weather Dashboard', description: 'An interactive Streamlit dashboard that retrieves current conditions and next-day forecasts from the OpenWeatherMap REST API.', details: ['Stores search history in CSV through Pandas with city and date filtering.', 'Calculates forecast minimum, maximum, and average temperatures and presents a trend chart.'], technologies: ['Python', 'REST API', 'Pandas', 'Streamlit'], href: 'https://github.com/TanvirHasanRatul09/weatherDashboard' },
  { title: 'Football Player Performance', description: 'An end-to-end analytics workflow that transforms a Kaggle football dataset into a four-page interactive Power BI report.', details: ['Cleaned and queried the dataset in SQL Server before modeling it in Power BI.', 'Built views for top performers, contributions, young talent, and future projections.'], technologies: ['SQL Server', 'Power Query', 'Power BI', 'Excel'], href: 'https://github.com/TanvirHasanRatul09/FootballTransfer' },
  { title: 'Cristiano Ronaldo Career Stats', description: 'An interactive dashboard analyzing Cristiano Ronaldo’s club career from the 2003/04 through 2024/25 seasons.', details: ['Tracks goals, assists, goal-per-match trends, and club-wise performance.', 'Uses interactive slicers, KPI cards, dynamic charts, and seasonal analysis.'], technologies: ['SQL Server', 'Power Query', 'Power BI', 'Excel'], href: 'https://github.com/TanvirHasanRatul09/cristiano-ronaldo-dashboard' },
  { title: 'Medicamp', description: 'A management system that streamlines registration, consultations, and medical records during health camps.', technologies: ['GitHub'], href: 'https://github.com/TanvirHasanRatul09?tab=repositories&q=Medicamp&type=&language=&sort=', searchLink: true },
  { title: 'Occupai', description: 'An AI-powered computer-vision application for real-time room occupancy tracking and spatial analysis.', technologies: ['Python', 'React', 'Computer Vision'], href: 'https://github.com/TanvirHasanRatul09?tab=repositories&q=Occupai&type=&language=&sort=', searchLink: true },
  { title: 'The Menu', description: 'A digital restaurant menu application designed for straightforward food browsing and order management.', technologies: ['GitHub'], href: 'https://github.com/TanvirHasanRatul09?tab=repositories&q=menu&type=&language=&sort=', searchLink: true },
  { title: 'Oggatonama', description: 'A collaborative web platform designed to help locate missing people and identify unidentified bodies.', technologies: ['Web Development'], href: 'https://github.com/PanthaProtick/oggatonama_web' },
]

export const socialLinks = {
  github: 'https://github.com/TanvirHasanRatul09',
  linkedin: 'https://www.linkedin.com/in/tanvir-hasan-595b9a2b0/',
  facebook: 'https://www.facebook.com/tanvirhasan.ratul.1',
  whatsapp: 'https://wa.me/8801608776259',
}
