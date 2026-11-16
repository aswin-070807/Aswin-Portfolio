// All portfolio content lives here. Edit this file to update the site.

export type ProjectCategory = "AI" | "Web" | "Publication";

export const profile = {
  name: "Aswin A",
  firstName: "Aswin",
  initials: "AA",
  greeting: "Hi there, I'm",
  roles: ["CSE Student", "Software Developer", "Hackathon Finalist", "AI Enthusiast"],
  pitch: "Building AI-powered products and winning hackathons — 3× National Hackathon Finalist.",
  availability: "Open to internships & freelance",
  resumeFolderUrl: "https://drive.google.com/drive/folders/1-51aXLTIuKgyTeFSe95_c89SLSWE7eMs",
  resumeUrl: "https://drive.google.com/file/d/1i5iDu_dZCw1L9EwnZ5j4Ts3X9MELZkDi/view?usp=sharing",
  location: "Tiruchirappalli, Tamil Nadu, India",
  email: "aswinacse787@gmail.com",
  phone: "+91 97152 70360",
  phoneHref: "tel:+919715270360",
  linkedin: "https://linkedin.com/in/aswin-a-709091293",
  linkedinLabel: "linkedin.com/in/aswin-a-709091293",
  github: "https://github.com/aswin-070807",
  githubLabel: "github.com/aswin-070807",
};

export const navLinks = [
  { id: "home", label: "Studio" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export const heroBadges = ["Python", "React", "C++", "GenAI", "Node.js"];

export const about = {
  text: "Versatile CSE student with coding proficiency, software development and data structures, backed by hackathon success (3× National Hackathon Finalist + 15 hackathons) and global certifications. Active on CodeChef (rated programmer) and LeetCode. I bring a blend of technical skill, creativity, and leadership to roles in software engineering, product development, and innovative tech solutions.",
  facts: [
    { label: "Location", value: "Tiruchirappalli, Tamil Nadu" },
    { label: "Studying", value: "B.E. CSE, Sri Ramakrishna Institute of Technology, Coimbatore" },
    { label: "CGPA", value: "8.11" },
    { label: "Status", value: "Open to opportunities" },
  ],
};

export const stats = [
  { value: 3, suffix: "×", label: "National Hackathon Finalist" },
  { value: 15, suffix: "+", label: "Hackathons" },
  { value: 15, suffix: "+", label: "Certifications" },
  {
    value: 3,
    suffix: "",
    label: "Major Projects",
    note: "Smart Study AI · Caliper AI · Anthology",
  },
];

export const skillGroups = [
  {
    title: "Programming",
    icon: "code",
    skills: [
      { name: "C", level: 85 },
      { name: "C++", level: 85 },
      { name: "Python", level: 88 },
      { name: "JavaScript", level: 80 },
    ],
  },
  {
    title: "Development",
    icon: "layers",
    skills: [
      { name: "Software Development", level: 85 },
      { name: "Data Structures", level: 82 },
      { name: "Git & GitHub", level: 85 },
      { name: "AI-Assisted Development", level: 90 },
      { name: "UI/UX Design", level: 78 },
      { name: "Basic SEO", level: 70 },
    ],
  },
  {
    title: "AI",
    icon: "sparkles",
    skills: [
      { name: "Generative AI Prompting", level: 92 },
      { name: "Prompt Strategy & Optimization", level: 88 },
    ],
  },
  {
    title: "Professional",
    icon: "users",
    skills: [
      { name: "Communication", level: 90 },
      { name: "Customer Relation Management", level: 85 },
      { name: "Leadership", level: 86 },
    ],
  },
] as const;

export const projectStack = ["React.js", "Node.js", "Python"];

export const marqueeTech = [
  "C",
  "C++",
  "Python",
  "JavaScript",
  "React.js",
  "Node.js",
  "Git",
  "GitHub",
  "Generative AI",
  "Figma",
  "MATLAB",
  "Google Analytics",
  "DevOps",
  "MLOps",
];

export const achievements = [
  {
    title: "Silver Medal",
    event: "International Innovation Expo (INVIDE 2026)",
    org: "University Malaysia Perlis",
    tag: "International",
    highlight: true,
  },
  {
    title: "National Finalist",
    event: "Neurohack 2026",
    org: "IIT Madras",
    tag: "National",
    highlight: true,
  },
  {
    title: "Finalist — Top 30",
    event: "SNS × ODOO & CIT Technova",
    org: "National hackathon",
    tag: "National",
    highlight: true,
  },
  {
    title: "Top 25,000 Teams",
    event: "Adobe University Hackathon",
    org: "Out of 3 Lakh+ teams",
    tag: "Global",
    highlight: false,
  },
  {
    title: "Score 83.7 / 100",
    event: "KRUU Grasp 72-hour Hackathon",
    org: "Project evaluation",
    tag: "Hackathon",
    highlight: false,
  },
  {
    title: "Rated Programmer",
    event: "CodeChef · LeetCode active",
    org: "Competitive programming",
    tag: "Coding",
    highlight: false,
  },
];

export const projects: {
  title: string;
  category: ProjectCategory;
  description: string;
  tags: string[];
  demo: string;
  repo: string;
  gradient: string;
}[] = [
  {
    title: "Smart Study AI",
    category: "AI",
    description:
      "A dedicated AI platform for students that makes sure every student understands what they read and write.",
    tags: ["React.js", "Node.js", "Python", "GenAI"],
    demo: "https://github.com/aswin-070807",
    repo: "https://github.com/aswin-070807",
    gradient: "thumb-1",
  },
  {
    title: "Caliper AI",
    category: "AI",
    description:
      "A dedicated AI platform for India's official statistical cadres that helps identify skill gaps and competencies.",
    tags: ["AI", "Web", "Analytics"],
    demo: "https://github.com/aswin-070807",
    repo: "https://github.com/aswin-070807",
    gradient: "thumb-2",
  },
  {
    title: "Being Myself: Anthology",
    category: "Publication",
    description:
      "Contributing author alongside 60 writers — original creative work highlighting individuality and storytelling.",
    tags: ["Publication", "Writing"],
    demo: "https://github.com/aswin-070807",
    repo: "https://github.com/aswin-070807",
    gradient: "thumb-3",
  },
];

export const projectFilters = ["All", "AI", "Web", "Publication"] as const;

export const experience = [
  {
    role: "Campus Representative",
    org: "GeeksforGeeks",
    period: "June 2026 – Present",
    points: [
      "Promoted AI learning initiatives across campus",
      "Organized workshops for students",
      "Strengthened peer engagement in the tech community",
    ],
  },
  {
    role: "Email & Chat Process Trainee",
    org: "Axonmet Technologies",
    period: "March 2026 – April 2026",
    points: [
      "Managed customer queries with clarity, empathy and professionalism",
      "Hands-on experience with CRM tools",
    ],
  },
];

export const education = [
  {
    degree: "B.E. Computer Science and Engineering",
    school: "Sri Ramakrishna Institute of Technology, Coimbatore",
    score: "CGPA 8.11",
    period: "Pursuing",
  },
  {
    degree: "HSC",
    school: "Chelammal Matriculation Higher Secondary School",
    score: "93.8%",
    period: "June 2024 – March 2025",
  },
  {
    degree: "SSLC",
    school: "Chelammal Matriculation Higher Secondary School",
    score: "94.8%",
    period: "June 2022 – April 2023",
  },
];

export const certifications = [
  { name: "Google Analytics Certificate", issuer: "Google" },
  { name: "Cyber Security with Generative AI", issuer: "IBM" },
  { name: "Design Thinking Practitioner", issuer: "IBM" },
  { name: "Clean Coding & DevOps", issuer: "IBM" },
  { name: "Model Armor: Securing AI", issuer: "Google Skill Cloud" },
  { name: "MLOps: Generative AI", issuer: "Google Skill Cloud" },
  { name: "Network Engineer", issuer: "NASSCOM, NSDC" },
  { name: "Machine Learning Onramp", issuer: "MATLAB" },
  { name: "Common Data Analysis Techniques", issuer: "MATLAB" },
  { name: "Fundamentals of Security", issuer: "Infosys Springboard" },
  { name: "Intro to Cybersecurity", issuer: "Infosys Springboard" },
  { name: "Design Thinking: A Primer", issuer: "NPTEL" },
  { name: "CPDQE Certified Diploma in Administrative HR Management", issuer: "Udemy" },
  { name: "Government Certified Typist — English (Senior Grade)", issuer: "Government" },
  { name: "Government Certified Typist — Tamil (Junior Grade)", issuer: "Government" },
];

export const services = [
  {
    icon: "globe",
    title: "Web & Full-Stack Development",
    description:
      "Fast, responsive websites and web apps built with React, Node.js and clean, maintainable code.",
  },
  {
    icon: "bot",
    title: "AI-Powered App Development",
    description:
      "Products that put generative AI to work — assistants, study tools and smart workflows.",
  },
  {
    icon: "palette",
    title: "UI/UX Design",
    description:
      "Clear, modern interfaces designed around your users, from wireframe to polished screens.",
  },
  {
    icon: "wand",
    title: "Prompt Engineering & AI Workflows",
    description:
      "Prompt strategies and AI pipelines that make your team faster and output more reliable.",
  },
  {
    icon: "chart",
    title: "SEO & Analytics Basics",
    description: "Search-friendly setup and Google Analytics tracking so you know what's working.",
  },
];

export const highlights = [
  {
    icon: "trophy",
    title: "Hackathon-proven",
    text: "3× national finalist. I ship working solutions under pressure.",
  },
  {
    icon: "zap",
    title: "Fast learner",
    text: "15+ certifications across AI, security, DevOps and design.",
  },
  {
    icon: "message",
    title: "Strong communicator",
    text: "Customer-facing experience — clear updates, no surprises.",
  },
  {
    icon: "flag",
    title: "Natural leader",
    text: "Campus Representative at GeeksforGeeks, running workshops.",
  },
];
