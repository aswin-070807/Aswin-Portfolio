import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { BackToTop, BackgroundOrbs, Navbar } from "@/components/portfolio/chrome";
import { Contact, Footer } from "@/components/portfolio/Contact";
import { CursorFog } from "@/components/portfolio/CursorFog";
import { Hero } from "@/components/portfolio/Hero";
import { MarqueeTape } from "@/components/portfolio/MarqueeTape";
import {
  About,
  Achievements,
  Certifications,
  Education,
  Experience,
  Highlights,
  PersonsOfInterest,
  Projects,
  Services,
  Skills,
} from "@/components/portfolio/sections";

const title = "Aswin A — CSE Student, Developer & 3× National Hackathon Finalist";
const description =
  "Portfolio of Aswin A: AI-powered products, hackathon achievements, skills, certifications and services. Open to internships & freelance.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: "/assets/hero-aswin.png",
        type: "image/png",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <MotionConfig reducedMotion="user">
      <BackgroundOrbs />
      <CursorFog />
      <div className="relative page-sky-flow min-h-screen text-[#0B1F4B] overflow-hidden">
        <Navbar />
        <main className="relative">
          <Hero />
          <MarqueeTape />
          <About />
          <Skills />
          <PersonsOfInterest />
          <Achievements />
          <Projects />
          <Experience />
          <Education />
          <Certifications />
          <Services />
          <Highlights />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </MotionConfig>
  );
}
