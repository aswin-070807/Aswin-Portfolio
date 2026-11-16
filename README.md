# Aswin A Creative Portfolio

Build a premium, award-level single-page personal portfolio website for **Aswin A**, a Computer Science & Engineering student and developer from Tiruchirappalli, Tamil Nadu, India. It must impress BOTH recruiters (fast scan: achievements, skills, resume) and freelance clients (projects, services, contact). Use React + TypeScript + Tailwind + shadcn/ui, Framer Motion for animations.

## Global design requirements

- Modern, polished, high-end look. Tech-forward but human. Primary accent: electric indigo/violet to cyan gradient. Clean typography (Inter or Plus Jakarta Sans for body, Space Grotesk or Sora for headings).
- **Dark/Light mode toggle** in the navbar (animated sun/moon icon), persisted in localStorage, defaulting to system preference. Both themes must look equally refined (use CSS variables / Tailwind dark class).
- Fully responsive (mobile-first), accessible (semantic HTML, focus states, alt text, prefers-reduced-motion respected), fast.
- Sticky glassmorphism navbar with smooth-scroll links and active-section highlighting, plus a mobile hamburger menu. Scroll progress bar at the top.
- Animations (Framer Motion): staggered hero entrance, scroll-reveal for every section, animated gradient/blurred orbs in the background, hover lift/tilt on cards, animated number counters for stats, typewriter/rotating text for roles, smooth page-load, magnetic buttons, subtle custom cursor glow on desktop. Keep it smooth, never janky.
- Back-to-top button, footer with socials, SEO meta tags + Open Graph, favicon with "A" monogram.

## Sections (in order)

1. **Hero**: Greeting, name "Aswin A", rotating typewriter roles: "CSE Student", "Software Developer", "Hackathon Finalist", "AI Enthusiast". One-line pitch: "Building AI-powered products and winning hackathons — 3× National Hackathon Finalist." CTAs: "View Projects", "Download Resume" (link to /resume.pdf placeholder), "Hire Me / Contact". Profile photo area: a large circular/rounded-blob framed photo with animated gradient ring and floating tech badges around it. **Use a clean placeholder avatar with initials "AA" for now, structured so the real photo can be dropped in at src/assets/profile.jpg** (I will upload my photo next). Small badges: "Open to internships & freelance".
2. **About Me**: Text: "Versatile CSE student with coding proficiency, software development and data structures, backed by hackathon success (3× National Hackathon Finalist + 15 hackathons) and global certifications. Active on CodeChef (rated programmer) and LeetCode. I bring a blend of technical skill, creativity, and leadership to roles in software engineering, product development, and innovative tech solutions." Add quick facts card: Location Tiruchirappalli, Tamil Nadu; Studying B.E. CSE, Sri Ramakrishna Institute of Technology, Coimbatore (CGPA 8.11); Status: Open to opportunities.
3. **Stats strip** with animated counters: 3× National Hackathon Finalist, 15+ Hackathons, 15+ Certifications, 3 Major Projects (Smart Study AI, Caliper AI, Anthology).
4. **Skills**: grouped cards with animated progress/chips and icons.
   - Programming: C, C++, Python, JavaScript
   - Development: Software Development, Data Structures, Git & GitHub, AI-Assisted Development, UI/UX Design, Basic SEO
   - AI: Generative AI Prompting, Prompt Strategy & Optimization
   - Professional: Communication, Customer Relation Management, Leadership
   - Also show tech stack used in projects: React.js, Node.js, Python.
     Include a marquee/infinite scroll of tech logos.
5. **Achievements & Hackathons** (vertical animated timeline or card grid, highlight with trophy icons):
   - Silver Medal, International Innovation Expo (INVIDE 2026), University Malaysia Perlis
   - National Finalist, IIT Madras, Neurohack 2026
   - SNS x ODOO & CIT Technova Finalist (Top 30)
   - Adobe University Hackathon: Top 25,000 teams out of 3 Lakh+ teams
   - KRUU Grasp 72-hour Hackathon: project score 83.7/100
   - CodeChef rated programmer; LeetCode active
6. **Projects** (large featured cards with hover effects, tech tags, gradient thumbnails, "Live Demo" and "GitHub" buttons as placeholders linking to github.com/aswin-070807):
   - **Smart Study AI**: A dedicated AI platform for students that makes sure every student understands what they read and write. Stack: React.js, Node.js, Python.
   - **Caliper AI**: A dedicated AI platform for India's official statistical cadres that helps identify skill gaps and competencies.
   - **Being Myself: Anthology** (Publication): Contributing author alongside 60 writers; original creative work highlighting individuality and storytelling.
     Add a project filter (All / AI / Web / Publication) with animated layout transitions.
7. **Experience** (animated timeline):
   - Campus Representative, GeeksforGeeks, June 2026 – Present: promoted AI learning initiatives, organized workshops, strengthened peer engagement.
   - Email & Chat Process Trainee, Axonmet Technologies, March 2026 – April 2026: managed customer queries with clarity, empathy and professionalism; hands-on with CRM tools.
8. **Education** (timeline): B.E. Computer Science and Engineering, Sri Ramakrishna Institute of Technology, Coimbatore, CGPA 8.11, pursuing. HSC, Chelammal Matriculation Higher Secondary School, 93.8%, June 2024 – March 2025. SSLC, Chelammal Matriculation Higher Secondary School, 94.8%, June 2022 – April 2023.
9. **Certifications** (grid of badge cards with issuer, searchable/filterable): Google Analytics Certificate (Google); Cyber Security with Generative AI (IBM); Design Thinking Practitioner (IBM); Clean Coding & DevOps (IBM); Model Armor: Securing AI, MLOps: Generative AI (Google Skill Cloud); Network Engineer (NASSCOM, NSDC); MATLAB: Machine Learning Onramp & Common Data Analysis Techniques; Infosys Springboard: Fundamentals of Security, Intro to Cybersecurity; NPTEL Design Thinking: A Primer; CPDQE Certified Diploma in Administrative HR Management (Udemy); Government Certified Typist, English (Senior Grade) and Tamil (Junior Grade).
10. **Services / What I Can Do for You** (for clients): Web & Full-Stack Development, AI-Powered App Development, UI/UX Design, Prompt Engineering & AI Workflow Optimization, SEO & Analytics basics. Each with icon and short description.
11. **Why Work With Me / Highlights**: short punchy cards (hackathon-proven problem solver, fast learner, strong communicator, leadership).
12. **Testimonials**: a carousel with 2–3 clearly marked placeholder cards, easy to edit later.
13. **Contact**: working-looking contact form (name, email, message) with validation and a success toast (front-end only for now; structure it so a backend/email can be connected later), plus direct links: email aswinacse787@gmail.com, phone +91 97152 70360, LinkedIn linkedin.com/in/aswin-a-709091293, GitHub github.com/aswin-070807, location Tiruchirappalli, Tamil Nadu. Include copy-to-clipboard for email and phone.
14. **Footer**: short sign-off, social icons, "© 2026 Aswin A".

## Quality bar

Keep all content in a single typed data file (src/data/portfolio.ts) so it's easy to edit. No lorem ipsum. Consistent spacing, no layout shift, 100% responsive, smooth 60fps animations, great Lighthouse scores. Make it look like a top-tier developer portfolio.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19641fa6-4c95-49b6-872f-6b702a302442).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
