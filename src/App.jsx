import { useCallback, useState } from 'react'
import { ArrowUpRight, Braces, Database, Download, Facebook, FileText, Github, Linkedin, Mail, MapPin, MessageCircle, Phone, Server, TerminalSquare } from 'lucide-react'
import { CinematicIntro } from './components/animation/CinematicIntro'
import { DeferredMotion } from './components/animation/DeferredMotion'
import { WebGLBackground } from './components/animation/WebGLBackground'
import { Header } from './components/layout/Header'
import { SectionHeading } from './components/layout/SectionHeading'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Separator } from './components/ui/separator'
import { education, projects, skills, socialLinks } from './data/portfolio'
import { supportsWebGL } from './lib/capabilities'

const iconMap = [Braces, Server, Database, TerminalSquare]

function ExternalLink({ href, children, className = '' }) {
  return <a href={href} target="_blank" rel="noreferrer" className={className}>{children}</a>
}

function App() {
  const [webglAvailable, setWebglAvailable] = useState(supportsWebGL)
  const handleAvailability = useCallback((available) => setWebglAvailable(available), [])
  const socialLinksLink = socialLinks.facebook

  return (
    <div className="min-h-dvh overflow-clip bg-[#1c0c23] text-zinc-100">
      <a href="#main-content" className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-md bg-white px-4 py-3 font-semibold text-zinc-950 transition-transform focus:translate-y-0">Skip to content</a>
      <div className="ambient-background" aria-hidden="true" />
      <WebGLBackground onAvailabilityChange={handleAvailability} />
      <DeferredMotion />
      <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress__bar" /></div>
      <Header />
      <CinematicIntro webglAvailable={webglAvailable} />

      <main id="main-content">
        <section id="hero" className="site-container relative flex min-h-dvh scroll-mt-20 items-center pb-16 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pb-20 lg:pt-24">
          <div className="backend-grid absolute inset-x-4 inset-y-20 -z-10 rounded-3xl opacity-50" aria-hidden="true" />
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
            <div className="order-2 max-w-3xl text-center lg:order-1 lg:text-left">
              <div className="mb-5 inline-flex min-h-9 items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 font-mono text-sm text-zinc-300">
                <span className="size-1.5 animate-pulse rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,.9)]" aria-hidden="true" />
                print(&quot;Hi, I&apos;m&quot;)
              </div>
              <h1 className="font-display text-[clamp(2.65rem,9vw,5.4rem)] font-extrabold leading-[.94] tracking-[-.06em] text-white">
                Tanvir Hasan <span className="hero-name-accent">Ratul.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[clamp(1.2rem,3.6vw,1.8rem)] font-semibold leading-tight tracking-[-.025em] text-zinc-200 lg:mx-0">Software Engineering <span className="text-rose-500">/</span> Backend Developer</p>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg lg:mx-0">Experienced building FastAPI backends, relational-database-driven applications, and Python data tools.</p>
              <div className="mt-9 flex items-center justify-center gap-4 font-mono text-xs uppercase tracking-[.16em] text-zinc-500 lg:justify-start">
                <span>Dhaka, Bangladesh</span><span className="h-px w-8 bg-white/15" /><span>Open to internships</span>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <div className="portrait-frame relative size-[clamp(12rem,53vw,21rem)] rounded-[42%_58%_50%_50%/48%_46%_54%_52%] p-[2px]">
                <div className="h-full w-full overflow-hidden rounded-[inherit] bg-zinc-900">
                  <img src="/profile.jpeg" alt="Tanvir Hasan Ratul" width="672" height="672" decoding="async" fetchPriority="high" className="h-full w-full object-cover object-center" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section-shell">
          <div className="site-container">
            <SectionHeading eyebrow="01 / Profile" title="Engineering reliable systems from the API outward." description="A Computer Science undergraduate seeking a Software Engineering or Backend Developer internship, with a practical focus on REST APIs, SQL, and object-oriented programming." />
            <div className="grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
              <Card className="premium-lift relative overflow-hidden p-6 sm:p-8">
                <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-rose-900/25 to-transparent" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-[.18em] text-zinc-500">Current focus</p>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white">Backend foundations that hold up under real use.</h3>
                <p className="mt-5 leading-7 text-zinc-400">I enjoy turning requirements into clean data models, predictable API contracts, and maintainable Python applications.</p>
              </Card>
              <Card className="premium-lift p-6 sm:p-8">
                <h3 className="font-display text-xl font-semibold text-white">Education</h3>
                <div className="mt-6 space-y-0">
                  {education.map((item, index) => <div key={item.school} className="relative border-l border-white/10 pb-7 pl-7 last:pb-0"><span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-zinc-950 bg-rose-600" /><p className="text-base font-semibold text-zinc-100">{item.school}</p><p className="mt-1 text-sm leading-6 text-zinc-400">{item.detail}</p><p className="mt-2 font-mono text-xs text-violet-300">{item.meta}</p>{index < education.length - 1 && <span className="sr-only">Next education entry</span>}</div>)}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="skills" className="section-shell">
          <div className="site-container">
            <SectionHeading eyebrow="02 / Capabilities" title="The tools behind the work." description="A focused toolkit for building APIs, relational systems, and practical data products." />
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((group, index) => { const Icon = iconMap[index]; return <Card key={group.title} className="premium-lift p-6 sm:p-7"><div className="flex items-center gap-3"><div className="skill-icon grid size-10 place-items-center rounded-md border border-rose-500/15 bg-rose-500/[0.07] text-rose-400"><Icon size={19} aria-hidden="true" /></div><h3 className="font-display text-lg font-semibold text-white">{group.title}</h3></div><div className="mt-5 flex flex-wrap gap-2">{group.items.map((item) => <Badge key={item}>{item}</Badge>)}</div></Card> })}
            </div>
          </div>
        </section>

        <section id="projects" className="section-shell">
          <div className="site-container">
            <SectionHeading eyebrow="03 / Selected work" title="Projects built around real problems." description="Backend systems, data products, and collaborative applications—from live monitoring to operational tools." />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => <Card key={project.title} className={`premium-lift group flex min-h-[22rem] flex-col p-6 ${project.featured ? 'md:col-span-1 xl:col-span-1 border-rose-900/40 bg-gradient-to-b from-rose-950/20 to-zinc-900/55' : ''}`}><div className="flex items-start justify-between gap-4"><span className="font-mono text-xs text-zinc-600">{String(index + 1).padStart(2, '0')}</span>{project.featured && <Badge className="border-rose-500/20 text-rose-300">Featured</Badge>}</div><h3 className="mt-8 font-display text-xl font-semibold tracking-tight text-white">{project.title}</h3><p className="mt-4 text-sm leading-6 text-zinc-300">{project.description}</p>{project.details && <ul className="mt-4 flex-1 space-y-2 text-sm leading-5 text-zinc-400">{project.details.map((detail) => <li key={detail} className="relative pl-4 before:absolute before:left-0 before:top-[.55rem] before:size-1 before:rounded-full before:bg-violet-400">{detail}</li>)}</ul>}<div className="mt-6 flex flex-wrap gap-1.5">{project.technologies.map((tech) => <Badge key={tech}>{tech}</Badge>)}</div><ExternalLink href={project.href} className="project-link mt-7 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-zinc-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"><Github size={17} aria-hidden="true" />{project.searchLink ? 'Find repository' : 'View repository'} <ArrowUpRight size={16} aria-hidden="true" /></ExternalLink></Card>)}
            </div>
          </div>
        </section>

        <section id="leetcode" className="section-shell">
          <div className="site-container"><Card className="premium-lift overflow-hidden p-7 sm:p-10"><div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]"><div><p className="font-mono text-xs uppercase tracking-[.2em] text-amber-400">04 / Problem solving</p><h2 className="mt-4 font-display text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-[-.04em] text-white">Practising clarity under constraints.</h2><p className="mt-4 max-w-2xl leading-7 text-zinc-400">Active in algorithmic problem solving and data-structure optimization through the LeetCode profile Destro69.</p></div><Button asChild><ExternalLink href="https://leetcode.com/u/Destro69/">View LeetCode <ArrowUpRight size={17} aria-hidden="true" /></ExternalLink></Button></div></Card></div>
        </section>

        <section id="certifications" className="section-shell">
          <div className="site-container">
            <SectionHeading eyebrow="05 / Credentials" title="Learning beyond the classroom." />
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="premium-lift p-6 sm:p-8"><p className="font-mono text-xs uppercase tracking-[.18em] text-violet-300">Leadership & activities</p><ul className="mt-6 space-y-5 text-zinc-300"><li className="border-l border-rose-700 pl-5"><strong className="block text-white">Deputy Coordinator</strong><span className="text-sm text-zinc-400">Department of Publication — AUST PIC</span></li><li className="border-l border-white/10 pl-5"><strong className="block text-white">Member</strong><span className="text-sm text-zinc-400">Josephite Math Club</span></li></ul></Card>
              <Card className="premium-lift p-6 sm:p-8"><p className="font-mono text-xs uppercase tracking-[.18em] text-violet-300">Certifications</p><ul className="mt-6 space-y-5 text-zinc-300"><li className="border-l border-rose-700 pl-5"><strong className="block text-white">Google Prompting Essentials</strong><span className="text-sm text-zinc-400">Coursera specialization</span></li><li className="border-l border-white/10 pl-5"><strong className="block text-white">Data Analytics</strong><span className="text-sm text-zinc-400">Excel · Power BI · Python · SQL — Tutorials Point Bangladesh</span></li></ul></Card>
            </div>
          </div>
        </section>

        <section id="contact" className="section-shell pb-16 sm:pb-24">
          <div className="site-container"><Card className="relative overflow-hidden p-7 sm:p-12"><div className="contact-glow" aria-hidden={true} /><div className="relative max-w-3xl"><p className="font-mono text-xs uppercase tracking-[.2em] text-rose-400">06 / Contact</p><h2 className="mt-5 font-display text-[clamp(2.35rem,8vw,5rem)] font-bold leading-[.98] tracking-[-.055em] text-white">Let&apos;s build something dependable.</h2><p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">I&apos;m looking for opportunities to contribute to thoughtful software teams and strengthen my backend engineering practice.</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild><a href="mailto:tanvirhasan58p@gmail.com"><Mail size={17} aria-hidden="true" /> Email me</a></Button><Button variant="outline" asChild><a href="tel:+8801608776259"><Phone size={17} aria-hidden="true" /> Call me</a></Button><Button variant="outline" asChild><a href="/Tanvir-Hasan-Ratul-Resume.pdf" target="_blank" rel="noreferrer"><FileText size={17} aria-hidden="true" /> View Resume</a></Button><Button variant="outline" asChild><a href="/Tanvir-Hasan-Ratul-Resume.pdf" download="Tanvir-Hasan-Ratul-Resume.pdf"><Download size={17} aria-hidden="true" /> Download Resume</a></Button></div><Separator className="my-8" /><div className="flex flex-col gap-4 text-sm text-zinc-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"><span className="inline-flex items-center gap-2"><MapPin size={16} aria-hidden="true" /> Narayanganj, Dhaka, Bangladesh</span><a className="inline-flex min-h-11 items-center gap-2 hover:text-white" href="mailto:tanvirhasan58p@gmail.com"><Mail size={16} aria-hidden="true" /> tanvirhasan58p@gmail.com</a><a className="inline-flex min-h-11 items-center gap-2 hover:text-white" href="tel:+8801608776259"><Phone size={16} aria-hidden="true" /> 01608776259</a></div><div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap"><SocialLink href={socialLinks.github} label="GitHub"><Github /></SocialLink><SocialLink href={socialLinks.linkedin} label="LinkedIn"><Linkedin /></SocialLink><SocialLink href={socialLinksLink} label="Facebook"><Facebook /></SocialLink><SocialLink href={socialLinks.whatsapp} label="WhatsApp"><MessageCircle /></SocialLink></div></div></Card></div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08] py-7"><div className="site-container flex flex-col gap-2 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Tanvir Hasan Ratul.</p><p className="font-mono text-xs">Designed for clarity. Built for reliability.</p></div></footer>
    </div>
  )
}

function SocialLink({ href, label, children }) {
  return <ExternalLink href={href} className="social-link inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"><span aria-hidden="true" className="[&>svg]:size-[18px]">{children}</span><span>{label}</span></ExternalLink>
}

export default App
