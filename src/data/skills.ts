export interface BookPage {
  pageNumber: number;
  title: string;
  category:
    | "intro"
    | "overview"
    | "industry"
    | "concepts"
    | "examples"
    | "projects"
    | "interviews"
    | "advanced"
    | "careers"
    | "summary";
  heading: string;
  subheading?: string;
  body: string;
  quote?: string;
  bulletPoints?: string[];
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  diagram?: {
    type: "flow" | "architecture" | "tree" | "radar" | "comparison";
    title: string;
    nodes: { label: string; desc: string; tag?: string }[];
  };
  interviewQuestions?: {
    question: string;
    answer: string;
    difficulty: "Basic" | "Intermediate" | "Advanced";
  }[];
  takeaways?: string[];
  metrics?: { label: string; value: string }[];
}

export interface SkillProject {
  title: string;
  desc: string;
  link?: string;
}

export interface SkillBook {
  id: string;
  name: string;
  bookTitle: string;
  subtitle: string;
  author: string;
  level: number; // 0 - 100
  label: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  years: string;
  summary: string;
  topTools: string[];
  spineColor: string;
  accentGlow: string;
  goldAccent?: boolean;
  height: number;
  width: number;
  pages: BookPage[];
}

const COMMON_PAGE_1_QUOTE =
  "Welcome to my interactive knowledge portfolio.\nEvery project, skill, and technology I have learned is documented here.\nMy goal is not only to showcase my work but also to help visitors learn something useful while exploring.";

export const SKILL_BOOKS: SkillBook[] = [
  // ==========================================
  // 1. PYTHON
  // ==========================================
  {
    id: "python",
    name: "Python",
    bookTitle: "Python Mastery & Systems",
    subtitle: "OOP, Automation, APIs & Architecture",
    author: "L. Ramalho / Aswin A",
    level: 95,
    label: "Expert",
    years: "3+ Years",
    summary:
      "High-speed algorithmic prototyping, AI agent orchestration, data engineering pipelines, and resilient backend microservices.",
    topTools: ["FastAPI", "NumPy", "PyTorch", "Pandas", "AsyncIO", "Celery", "Pydantic"],
    spineColor: "linear-gradient(180deg, #1e3a5f 0%, #162a45 100%)",
    accentGlow: "rgba(56, 189, 248, 0.5)",
    goldAccent: true,
    height: 184,
    width: 34,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "Welcome to Python Engineering",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "Python is more than a scripting language; it is the lingua franca of modern artificial intelligence, high-throughput backend services, and rapid systems engineering. Through this book, you will explore how I employ Python to bridge algorithmic theory with production-grade AI applications.",
        bulletPoints: [
          "Understand clean idiomatic Python (PEP 8, Typing, Protocols)",
          "Master concurrency models with AsyncIO and Threading",
          "Build scalable microservice architectures with FastAPI & Pydantic",
          "Explore real-world hackathon winning pipelines and AI agents",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "Python Ecosystem & Runtime Architecture",
        subheading: "Dynamic Semantics with Interpreted Performance",
        body: "Python combines dynamic typing with an extensive C-extension ecosystem (NumPy, Cython, PyTorch). Under the hood, CPython compiles code into bytecode executed on a stack-based virtual machine, governed by the Global Interpreter Lock (GIL) and an adaptive reference-counting garbage collector with cyclic detection.",
        diagram: {
          type: "architecture",
          title: "CPython Execution Flow",
          nodes: [
            {
              label: "Source (.py)",
              desc: "AST Generation & Bytecode Compilation",
              tag: "Frontend",
            },
            {
              label: "Bytecode (.pyc)",
              desc: "Opcode stream targeting CPython VM",
              tag: "Intermediary",
            },
            { label: "CPython VM", desc: "Stack evaluation + GIL synchronization", tag: "Runtime" },
            { label: "C-API / Extensions", desc: "Vectorized SIMD & GPU kernels", tag: "Hardware" },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "Why Tech Giants Depend on Python",
        subheading: "Unmatched Developer Velocity & AI Supremacy",
        body: "From OpenAI's research clusters to Netflix's recommendation engines, Python powers the world's most sophisticated computational workloads. Its expressive syntax reduces time-to-market by up to 60% compared to compiled alternatives, while modern type hinting has transformed it into an enterprise-grade language.",
        metrics: [
          { label: "AI & ML Market Share", value: "82%" },
          { label: "Developer Productivity", value: "+45%" },
          { label: "Avg Backend Latency (FastAPI)", value: "<8ms" },
        ],
        bulletPoints: [
          "De facto foundation for TensorFlow, PyTorch, LangChain, and Hugging Face",
          "Rapid iteration cycles in competitive hackathons and startup MVPs",
          "Seamless glue layer between low-level C++ drivers and distributed cloud clusters",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "Deep Idiomatic Foundations",
        subheading: "OOP, Dunder Methods & Metaprogramming",
        body: "Mastering Python requires looking beyond basic syntax to understand object models, protocols, and descriptors. Everything in Python is first-class, from functions to classes themselves.",
        bulletPoints: [
          "Data Model & Dunder Methods: __call__, __enter__, __exit__, __getitem__",
          "Object-Oriented Design: Polymorphism, Abstract Base Classes (ABCs), Multiple Inheritance (MRO)",
          "Decorators & Context Managers: Reusable cross-cutting concerns and safe resource teardown",
          "Data Structures: Hash map hash-collision resolution, list amortized growth, generator iterators",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "Production Code Architecture",
        subheading: "Async Worker with Backpressure & Typing",
        body: "Below is a pattern I frequently implement in hackathons for asynchronous event polling with structured concurrency and error resilience.",
        codeSnippet: {
          language: "python",
          caption: "Async Task Pipeline with Pydantic & AsyncIO",
          code: `import asyncio
from pydantic import BaseModel, Field

class PipelineTask(BaseModel):
    task_id: str
    payload: dict = Field(default_factory=dict)
    priority: int = 1

async def process_task(task: PipelineTask) -> bool:
    # Non-blocking async compute
    await asyncio.sleep(0.05)
    return True

async def worker_pool(queue: asyncio.Queue, worker_id: int):
    while True:
        task: PipelineTask = await queue.get()
        try:
            success = await process_task(task)
        finally:
            queue.task_done()`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "Aswin's Flagship Python Systems",
        subheading: "Battle-Tested in National Hackathons",
        body: "I have leveraged Python as the core engine in national finals, processing multimodal documents and driving precision automated analytics.",
        bulletPoints: [
          "Smart Study AI: FastAPI backend orchestrating PDF chunking, LangChain embeddings, and dynamic question synthesis.",
          "Caliper AI: Automated statistical competence evaluator built for India's official cadre datasets, processing tabular telemetry in milliseconds.",
          "Agentic IDE Engine: Asynchronous tool execution server dispatching file edits, shell diagnostics, and git operations with zero deadlocks.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "Senior & Staff Python Questions",
        subheading: "Concept Clarification for Interviews",
        body: "Here are real interview problems I have solved and coached peers on:",
        interviewQuestions: [
          {
            question: "How does the Python GIL impact CPU-bound vs IO-bound tasks?",
            answer:
              "The GIL allows only one OS thread to execute Python bytecode at once. For IO-bound tasks (network, disk), threads release the GIL during blocking calls, allowing high concurrency. For CPU-bound tasks, multithreading does not scale; multiprocessing or C-extensions (freeing the GIL via Py_BEGIN_ALLOW_THREADS) must be used.",
            difficulty: "Intermediate",
          },
          {
            question: "Explain the difference between deepcopy, shallow copy, and assignment.",
            answer:
              "Assignment copies the memory reference only. A shallow copy (copy.copy) creates a new compound object but inserts references to the original child objects. A deep copy (copy.deepcopy) recursively copies all nested compound objects, creating fully independent data hierarchies.",
            difficulty: "Basic",
          },
          {
            question: "How do Python descriptors work and where are they used in frameworks?",
            answer:
              "Descriptors are objects implementing __get__, __set__, or __delete__. They power @property, methods, staticmethod, classmethod, and ORM attribute mappers like SQLAlchemy and Django models by intercepting attribute lookup during getattr/setattr.",
            difficulty: "Advanced",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "Low-Level Internals & Optimization",
        subheading: "Memory Allocation, JIT & Free-Threaded Python",
        body: "When latency matters, deep profiling and C-extension interoperability are essential.",
        bulletPoints: [
          "PyMalloc & Arena Allocations: Small object pool (<512 bytes) preventing OS heap fragmentation",
          "PEP 703 (Free-Threaded CPython 3.13+): Disabling the GIL for true multi-core thread scaling",
          "Profiling & Cython: Identifying hotspots with cProfile/py-spy and compiling inner loops to C",
          "Zero-Copy Memoryviews: Direct buffer protocol manipulation without heap duplication",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "Industry Pathways with Python",
        subheading: "Roles, Expectations & Impact",
        body: "Python proficiency opens doorways across mission-critical tech specializations:",
        diagram: {
          type: "tree",
          title: "Career Specialization Matrix",
          nodes: [
            {
              label: "AI / LLM Engineer",
              desc: "Orchestrating agents, RAG pipelines, fine-tuning",
            },
            {
              label: "Backend Architect",
              desc: "FastAPI, distributed queues, microservice scalability",
            },
            {
              label: "MLOps Specialist",
              desc: "Model serving, continuous training, latency monitoring",
            },
            {
              label: "Automation Engineer",
              desc: "Infrastructure CI/CD, system telemetry, testing frameworks",
            },
          ],
        },
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "Python Master Checklist",
        subheading: "Golden Rules for Writing Elite Python",
        body: "Congratulations on exploring this chapter! Here is a distilled checklist to carry into your next engineering project:",
        takeaways: [
          "Write readable, explicit code: 'Simple is better than complex' (Zen of Python).",
          "Use typing and Pydantic everywhere in production interfaces.",
          "Profile before optimizing: 90% of execution time is spent in 10% of the code.",
          "Embrace async I/O for network-bound microservices.",
          "Keep memory footprints clean with generators and context managers.",
        ],
      },
    ],
  },

  // ==========================================
  // 2. GENAI / LLMS
  // ==========================================
  {
    id: "genai",
    name: "GenAI & LLMs",
    bookTitle: "Autonomous AI & LLM Systems",
    subtitle: "RAG, Multi-Agent Swarms & Vector DBs",
    author: "DeepMind / Aswin A",
    level: 92,
    label: "Expert",
    years: "2+ Years",
    summary:
      "Multi-agent workflows, semantic vector retrieval (RAG), tool calling, chain-of-thought architectures, and enterprise AI productionization.",
    topTools: [
      "Gemini API",
      "OpenAI",
      "LangChain",
      "ChromaDB",
      "LlamaIndex",
      "Hugging Face",
      "Qdrant",
    ],
    spineColor: "linear-gradient(180deg, #3b1d5c 0%, #281240 100%)",
    accentGlow: "rgba(168, 85, 247, 0.55)",
    goldAccent: true,
    height: 188,
    width: 36,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "The Generative AI Frontier",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "Generative AI represents a fundamental paradigm shift from rule-based programming to probabilistic cognitive computing. This volume explains how modern Large Language Models operate, how to ground them with Retrieval-Augmented Generation (RAG), and how to orchestrate multi-agent swarms that execute autonomous tools.",
        bulletPoints: [
          "Transformer architecture & self-attention mechanisms",
          "Retrieval-Augmented Generation (RAG) with vector databases",
          "Autonomous agent patterns: ReAct, Plan-and-Solve, Reflection",
          "Production deployment, token economics, and hallucination guardrails",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "Transformer Foundations & Autoregressive Inference",
        subheading: "From Attention Heads to Emergent Reasoning",
        body: "At the heart of every LLM is the Transformer architecture (Vaswani et al., 2017). Autoregressive models predict the next token probability distribution given an input sequence by computing Query-Key-Value attention across high-dimensional latent space.",
        diagram: {
          type: "architecture",
          title: "Generative Inference Pipeline",
          nodes: [
            {
              label: "Tokenization (BPE)",
              desc: "Text split into subword tokens",
              tag: "Pre-process",
            },
            { label: "Self-Attention", desc: "Q-K-V dot product scaled matrix", tag: "Context" },
            {
              label: "Feed-Forward Layers",
              desc: "Non-linear latent transformations",
              tag: "Compute",
            },
            {
              label: "Softmax Sampler",
              desc: "Temperature, top-p, top-k selection",
              tag: "Output",
            },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "The Cognitive Layer of Enterprise Software",
        subheading: "Transforming Knowledge Work and Automation",
        body: "GenAI is not a feature; it is an infrastructure layer. Companies that adopt structured AI workflows achieve order-of-magnitude efficiency gains in documentation, synthesis, customer intelligence, and code development.",
        metrics: [
          { label: "Industry Adoption Growth", value: "320% YoY" },
          { label: "Workflow Automation Gain", value: "5x - 10x" },
          { label: "Semantic Search Accuracy", value: "94%" },
        ],
        bulletPoints: [
          "Elimination of brittle keyword search via dense vector embeddings",
          "Automated reasoning pipelines that replace thousands of lines of hardcoded logic",
          "Continuous interactive learning agents that adapt to specialized domains",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "The Modern AI Stack",
        subheading: "Prompting, RAG, Embeddings & Agents",
        body: "Building reliable AI systems requires composing several decoupled architectural primitives:",
        bulletPoints: [
          "Dense Vector Embeddings: Mapping semantic meaning into 768-3072 dimensional space (cosine similarity)",
          "Hierarchical Chunking: Parent-child document chunking to preserve both local precision and global context",
          "Reranking (Cross-Encoders): Re-scoring retrieved passages before feeding them into context windows",
          "Function & Tool Calling: Constraining LLM outputs to validated JSON schemas for API invocation",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "Production RAG with Hybrid Search",
        subheading: "Synthesizing Retrieval with Structured Prompts",
        body: "Here is an example of an autonomous agent tool dispatcher that handles validated structured outputs:",
        codeSnippet: {
          language: "typescript",
          caption: "Autonomous Function Calling Tool Engine",
          code: `interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

async function executeAgentStep(prompt: string, tools: ToolDefinition[]) {
  const response = await ai.generate({
    model: "gemini-2.0-flash",
    systemPrompt: "You are an autonomous engineering assistant. Use tools when necessary.",
    tools: tools,
    input: prompt
  });

  if (response.toolCalls?.length) {
    for (const call of response.toolCalls) {
      console.log(\`Invoking: \${call.name} with \`, call.arguments);
      const result = await registry.dispatch(call.name, call.arguments);
      // Feedback result into context memory
    }
  }
  return response.content;
}`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "Aswin's AI Implementations",
        subheading: "High-Impact AI in Hackathons & Education",
        body: "I have designed and deployed end-to-end AI products evaluated by international juries and university faculties.",
        bulletPoints: [
          "Smart Study AI: Full multimodal RAG platform parsing textbooks into interactive question banks, concept roadmaps, and instant explanations.",
          "Caliper AI: Intelligent competencies matcher for India's national statistical services, extracting skill affinities from unstructured resumes.",
          "Autonomous Pair Programmer: Subagent architecture featuring real-time file tree modification, multi-step error correction, and test validation.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "GenAI & LLM Architecture Interviews",
        subheading: "High-Yield Technical Discussions",
        body: "Frequently encountered interview questions for GenAI and Machine Learning engineering roles:",
        interviewQuestions: [
          {
            question: "How do you mitigate hallucinations in production RAG systems?",
            answer:
              "1) Grounding prompt constraints ('Answer only using provided context'). 2) Multi-step verification / self-reflection (asking the model to cite specific line IDs). 3) High-precision rerankers like Cohere Rerank. 4) Strict temperature tuning (0.0 to 0.2). 5) Automated guardrails like NeMo Guardrails or G-Eval.",
            difficulty: "Intermediate",
          },
          {
            question: "What is the difference between Fine-Tuning and In-Context RAG?",
            answer:
              "Fine-tuning alters the model's internal neural weights (best for learning style, vocabulary, or strict output formatting). RAG provides external dynamic knowledge at inference time (best for up-to-date facts, private enterprise docs, and low-cost updates without training runs).",
            difficulty: "Basic",
          },
          {
            question: "Explain the ReAct (Reasoning + Acting) agent loop.",
            answer:
              "ReAct prompts an LLM to alternate between Thought (planning the next step), Action (calling an external API/tool), and Observation (evaluating tool output), repeating until the goal is achieved. This prevents premature hallucinations and enables multi-step real-world workflows.",
            difficulty: "Advanced",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "Frontier AI Paradigms",
        subheading: "Quantization, LoRA & Speculative Decoding",
        body: "Cutting-edge techniques to minimize latency and memory overhead in production inference:",
        bulletPoints: [
          "Parameter-Efficient Fine-Tuning (PEFT / LoRA): Training low-rank decomposition matrices while freezing the base model weights",
          "Quantization (AWQ, GPTQ, GGUF): Reducing 16-bit FP weights to 4-bit/8-bit integers with minimal perplexity loss",
          "KV Cache Optimization: Caching Key-Value attention vectors across autoregressive generation to avoid quadratic recomputations",
          "Vector Index Algorithms: HNSW (Hierarchical Navigable Small World) graph vs IVF (Inverted File) for million-scale queries",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "The GenAI Job Landscape",
        subheading: "High-Demand Roles & Emerging Opportunities",
        body: "Specializing in GenAI positions you at the focal point of modern tech innovation:",
        bulletPoints: [
          "AI Product Engineer: Bridging user experience with LLM orchestration and API integrations",
          "RAG & Search Engineer: Optimizing embedding models, hybrid search, and knowledge graph stores",
          "AI Safety & Evaluation Specialist: Benchmarking model outputs, hallucination metrics, and compliance",
          "Applied AI Researcher: Adapting foundation models for vertical domains (medical, legal, finance)",
        ],
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "GenAI Engineering Takeaways",
        subheading: "Guiding Principles for AI Architects",
        body: "Key insights to keep in mind when engineering production AI systems:",
        takeaways: [
          "A great prompt cannot fix bad context: invest 80% of your effort into retrieval quality.",
          "Always log token metrics, latencies, and user feedback loops.",
          "Use deterministic fallbacks for mission-critical logic when probabilistic LLMs fail.",
          "Design for modularity: models will change every 3-6 months; your orchestration layer should stay resilient.",
        ],
      },
    ],
  },

  // ==========================================
  // 3. REACT & TYPESCRIPT
  // ==========================================
  {
    id: "react",
    name: "React & TypeScript",
    bookTitle: "React 19 & Modern UI Architecture",
    subtitle: "Hooks, Server Components, State & Framer",
    author: "Dan A. / Aswin A",
    level: 92,
    label: "Expert",
    years: "3+ Years",
    summary:
      "Architecting modular, 60fps interactive frontends with strict TypeScript safety, server-driven routing, and fluid micro-interactions.",
    topTools: [
      "React 19",
      "TypeScript",
      "TanStack Router",
      "Framer Motion",
      "Tailwind CSS",
      "Zustand",
      "Vite",
    ],
    spineColor: "linear-gradient(180deg, #0e4e68 0%, #073345 100%)",
    accentGlow: "rgba(6, 182, 212, 0.5)",
    goldAccent: true,
    height: 186,
    width: 36,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "Mastering Modern Frontends",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "Frontend engineering has evolved from rendering static markup into orchestrating rich, high-performance distributed state machines. This book documents how I design user interfaces that are accessible, maintainable, and visually stunning at 60 frames per second.",
        bulletPoints: [
          "React 19 Actions, use(), and compiler paradigms",
          "Strict TypeScript type safety and generics",
          "State management topologies: Local, Global, and Server State",
          "Fluid micro-animations with Framer Motion and GPU transforms",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "The Declarative Component Model",
        subheading: "Virtual DOM, Fiber Reconciliation & Concurrent Mode",
        body: "React's breakthrough was modeling UI as a pure projection of state: UI = f(state). Behind the scenes, the Fiber reconciliation engine breaks rendering work into interruptible units, prioritizing user input over background re-renders.",
        diagram: {
          type: "flow",
          title: "React Concurrent Reconciliation Flow",
          nodes: [
            { label: "State Update", desc: "User click / API response", tag: "Trigger" },
            { label: "Render Phase", desc: "Fiber tree diffing in memory", tag: "Interruptible" },
            { label: "Commit Phase", desc: "Mutations applied to real DOM", tag: "Synchronous" },
            {
              label: "Layout Effects",
              desc: "useLayoutEffect & paint calculation",
              tag: "Screen Paint",
            },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "The Backbone of the Interactive Web",
        subheading: "Standardizing Enterprise Web Applications",
        body: "React remains the world's most demanded frontend framework. When combined with TypeScript, it eliminates entire classes of runtime errors, enforces clean API contracts across teams, and unlocks instant global distribution through edge rendering.",
        metrics: [
          { label: "Global Web App Dominance", value: "73%" },
          { label: "TypeScript Safety Gain", value: "38% less bugs" },
          { label: "Animation Frame Target", value: "60 - 120 FPS" },
        ],
        bulletPoints: [
          "Vast ecosystem of battle-tested primitives (Radix UI, TanStack, Lucide)",
          "Cross-platform synergy across Web, Mobile (React Native), and 3D Canvas (Three/Fiber)",
          "High reusability through component-driven design systems",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "Hooks & Component Lifecycles",
        subheading: "Understanding the Rules of React Hooks",
        body: "Hooks allow components to subscribe to stateful computations and side effects without class hierarchies.",
        bulletPoints: [
          "useState & useReducer: Managing immutable state transitions",
          "useEffect & useEffectEvent: Synchronizing with non-React external systems",
          "useMemo & useCallback: Referential stability for high-cost child computations",
          "Custom Hooks: Abstracting reusable logic like media queries, parallax springs, and audio state",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "Spring-Physics Interactive Component",
        subheading: "Framer Motion Parallax Card",
        body: "Below is the real pattern I use for smooth physics-driven interactive cards that react smoothly to user cursor positions:",
        codeSnippet: {
          language: "tsx",
          caption: "Parallax Spring Motion Card",
          code: `import { motion, useSpring } from "framer-motion";

export function FloatingCard({ children }: { children: React.ReactNode }) {
  const rotateX = useSpring(0, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-ny * 15);
    rotateY.set(nx * 15);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl"
    >
      {children}
    </motion.div>
  );
}`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "React Applications Built by Aswin",
        subheading: "Production Systems and Creative Showcases",
        body: "Every interactive element in this portfolio is crafted with custom React 19 architecture:",
        bulletPoints: [
          "This Interactive 3D Portfolio: Custom anti-gravity study room, 3D animated bookshelf, real-time audio/video monitor, and 10-page flip engine.",
          "Smart Study AI Frontend: High-speed study dashboard with TanStack Router, markdown syntax rendering, and instant AI chat.",
          "Caliper AI Analytics Dashboard: Complex tabular data visualizations, interactive radar charts, and real-time candidate ranking cards.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "React Technical Interview Mastery",
        subheading: "Deep Dives into Rerender Semantics",
        body: "Key questions asked during frontend engineering interviews:",
        interviewQuestions: [
          {
            question:
              "Why does React require keys in lists, and what happens if you use the array index?",
            answer:
              "Keys allow React's reconciler to match existing DOM nodes across renders. Using array indices breaks identity when items are prepended, sorted, or deleted, causing internal input state to leak into wrong rows and forcing unnecessary full DOM re-creations.",
            difficulty: "Basic",
          },
          {
            question: "What causes unnecessary rerenders and how do you profile them?",
            answer:
              "Unnecessary rerenders stem from: 1) Non-primitive props creating new memory references every render, 2) Context providers passing unmemoized values, 3) Lifting state too high. You profile them using the React DevTools Profiler (flamegraph and 'Why did this render?').",
            difficulty: "Intermediate",
          },
          {
            question:
              "How does React 19's Server Actions model change client-server communication?",
            answer:
              "Server Actions allow asynchronous functions to be defined on the server and called seamlessly from client forms or event handlers without writing manual fetch boilerplate, managing automatic optimistic rollbacks, transition pending states, and cache revalidation.",
            difficulty: "Advanced",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "Performance Optimization & Internals",
        subheading: "Re-render Budgets, Code Splitting & WebGL",
        body: "Techniques for maintaining silky smooth 60 FPS under heavy interaction:",
        bulletPoints: [
          "Code Splitting via React.lazy & Dynamic Imports: Reducing initial bundle size for instant LCP",
          "Web Workers for Off-Main-Thread Compute: Moving heavy vector math off the UI thread",
          "CSS GPU Acceleration: Restricting animations to transform and opacity to bypass layout reflows",
          "Zustand Selective Selectors: Preventing rerenders unless the specific sliced property changes",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "Frontend & Full-Stack Career Paths",
        subheading: "Where React Expertise Creates Immediate Impact",
        body: "React and TypeScript are foundational to modern high-impact engineering:",
        bulletPoints: [
          "Senior Frontend Engineer: Leading component architecture and design system consistency",
          "Design Engineer: Blending Figma fidelity with production code, micro-animations, and shaders",
          "Full-Stack Developer: Pairing Next.js / TanStack Start with backend microservices",
          "Engineering Lead: Setting code review standards, test coverage, and accessibility compliance",
        ],
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "React Architecture Checklist",
        subheading: "Principles for Building World-Class Frontends",
        body: "Summary takeaways for designing modern React applications:",
        takeaways: [
          "Keep state as close to where it is used as possible.",
          "Leverage TypeScript strict mode to enforce clear component interfaces.",
          "Never animate layout properties (width, top, margin); always animate transform and opacity.",
          "Design for accessibility (ARIA, keyboard navigation, reduced motion preferences).",
        ],
      },
    ],
  },

  // ==========================================
  // 4. NODE.JS & BACKEND
  // ==========================================
  {
    id: "nodejs",
    name: "Node.js & Backend",
    bookTitle: "Node.js Backend Architecture",
    subtitle: "APIs, Authentication, Streams & Distributed Systems",
    author: "M. Casciaro / Aswin A",
    level: 88,
    label: "Advanced",
    years: "2.5 Years",
    summary:
      "High-throughput event loops, Express/Fastify APIs, JWT authentication, PostgreSQL relational design, and resilient cloud microservices.",
    topTools: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "JWT", "Docker"],
    spineColor: "linear-gradient(180deg, #1b4d3e 0%, #113329 100%)",
    accentGlow: "rgba(34, 197, 94, 0.5)",
    goldAccent: false,
    height: 178,
    width: 33,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "Modern Backend Engineering",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "Backends are the silent engines powering the digital world. This book explores how Node.js leverages the V8 JavaScript runtime and libuv event loop to serve millions of asynchronous requests with low memory footprints and rock-solid reliability.",
        bulletPoints: [
          "Libuv event loop phases and non-blocking I/O",
          "RESTful and WebSocket API architectures",
          "Enterprise authentication with JWT, OAuth2, and secure cookies",
          "Database connection pooling, migrations, and caching layers",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "The Asynchronous Event Loop",
        subheading: "Single-Threaded Execution with Multi-Threaded I/O",
        body: "Node.js runs your JavaScript code on a single thread, offloading file system operations, DNS lookups, and network sockets to libuv's thread pool and OS kernel epoll/kqueue mechanisms.",
        diagram: {
          type: "architecture",
          title: "Libuv Event Loop Lifecycle",
          nodes: [
            { label: "Timers", desc: "setTimeout & setInterval callbacks", tag: "Phase 1" },
            {
              label: "Pending Callbacks",
              desc: "I/O errors and OS notification callbacks",
              tag: "Phase 2",
            },
            {
              label: "Poll Phase",
              desc: "Retrieving incoming I/O events & connections",
              tag: "Phase 3",
            },
            { label: "Check Phase", desc: "setImmediate callbacks execute here", tag: "Phase 4" },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "Unified JavaScript Across the Stack",
        subheading: "Shared Models, High Throughput & Microservices",
        body: "Companies like PayPal, Netflix, and Uber shifted mission-critical tiers to Node.js, reporting a 35% drop in response times and double the requests served per core compared to traditional thread-per-request architectures.",
        metrics: [
          { label: "Throughput Advantage", value: "2x per CPU core" },
          { label: "Developer Context Switching", value: "Near Zero" },
          { label: "Avg Request Latency", value: "<12ms" },
        ],
        bulletPoints: [
          "Code sharing between frontend and backend via shared TypeScript types",
          "Massive NPM ecosystem of tested micro-packages and connectors",
          "Ideal for real-time collaboration tools, streaming video, and webhook processors",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "Core Architecture Primitives",
        subheading: "Middleware Chains, Streams & Memory Buffers",
        body: "Clean backend architecture relies on predictable data pipelines:",
        bulletPoints: [
          "Middleware Pipeline: Express/Koa onion architecture handling auth, logging, and rate-limiting",
          "Streams & Backpressure: Reading multi-gigabyte files chunk-by-chunk without exhausting RAM",
          "Authentication: Asymmetric RS256 JWT tokens, refresh token rotation, and password hashing with Argon2",
          "Error Handling: Centralized error middleware with standardized RFC 7807 problem details",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "Production REST Controller with Auth",
        subheading: "Clean Service Layer with Zod Validation",
        body: "Here is an idiomatic service controller pattern with schema validation and safe database transactions:",
        codeSnippet: {
          language: "typescript",
          caption: "Secure Authenticated Route Handler",
          code: `import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const UpdateProfileSchema = z.object({
  bio: z.string().max(280),
  skills: z.array(z.string()).min(1),
});

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id; // From auth middleware
    const data = UpdateProfileSchema.parse(req.body);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { bio: data.bio, skills: data.skills },
      select: { id: true, name: true, bio: true, skills: true }
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "Aswin's Backend Infrastructure",
        subheading: "Scalable APIs Engineered Under Pressure",
        body: "Real systems I have built using Node.js:",
        bulletPoints: [
          "Smart Study AI Authentication Gateway: JWT-protected endpoints managing student accounts, study session history, and rate-limited LLM calls.",
          "Real-Time Collaborative Code Room: Node.js WebSocket server managing multi-client operational transformations and live cursor syncing.",
          "Caliper AI Ingestion Worker: Background batch processor parsing CSV/JSON data uploads into relational database rows with transaction rollback.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "Backend Interview Challenges",
        subheading: "Deep Technical Inquiries",
        body: "Common interview questions for backend software developers:",
        interviewQuestions: [
          {
            question: "What is backpressure in Node.js streams and why does it matter?",
            answer:
              "Backpressure occurs when the data reader (destination) cannot consume data as fast as the writer (source) produces it. Without backpressure, chunks accumulate in memory buffer queues until process RAM is exhausted (OOM crash). Streams manage backpressure using .pause() and .resume() via pipeline().",
            difficulty: "Intermediate",
          },
          {
            question: "What is the difference between process.nextTick() and setImmediate()?",
            answer:
              "process.nextTick() callbacks fire immediately after the current operation finishes, before the event loop advances to any other phase. setImmediate() executes during the Check phase of the current event loop iteration. Overusing nextTick can starve the event loop of I/O.",
            difficulty: "Intermediate",
          },
          {
            question: "How do you securely handle sensitive credentials and secret keys?",
            answer:
              "Never commit secrets to git. Store them in secure cloud key vaults (AWS Secrets Manager, GCP Secret Manager) or encrypted .env files injected at container runtime, validating with strict startup schemas (e.g., Zod env validation) so the app crashes early if a secret is missing.",
            difficulty: "Basic",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "Distributed Scale & Cluster Mode",
        subheading: "Microservice Resiliency & Worker Threads",
        body: "Scaling Node.js beyond single-process constraints:",
        bulletPoints: [
          "Cluster Module & PM2: Spawning worker processes across all physical CPU cores with shared ports",
          "Worker Threads (worker_threads): Running compute-heavy crypto, hashing, or image processing without stalling I/O",
          "Redis Distributed Locking: Using Redlock algorithms for mutual exclusion across multiple server instances",
          "Graceful Shutdown Handling: Intercepting SIGTERM/SIGINT to close DB pools and finish in-flight HTTP requests",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "Backend Engineering Horizons",
        subheading: "Roles, Responsibilities & Architecture",
        body: "Backend engineers ensure software systems stay fast, secure, and always available:",
        bulletPoints: [
          "Backend Software Engineer: Creating resilient REST and GraphQL APIs",
          "API Integration Specialist: Connecting third-party payment gateways, CRM, and cloud services",
          "Database Administrator / Data Engineer: Optimizing indexing, migrations, and query latency",
          "Cloud Platform Engineer: Containerizing workloads with Docker and Kubernetes",
        ],
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "Backend Golden Standards",
        subheading: "Rules of Resilient Server Engineering",
        body: "Key takeaways to design rock-solid backends:",
        takeaways: [
          "Never block the event loop: push CPU-intensive workloads to worker threads or external task queues.",
          "Always validate request inputs strictly at the API perimeter.",
          "Use connection pooling for databases to avoid socket exhaustion.",
          "Implement structured JSON logging with request IDs for distributed observability.",
        ],
      },
    ],
  },

  // ==========================================
  // 5. C++
  // ==========================================
  {
    id: "cpp",
    name: "C++",
    bookTitle: "Modern C++ & Systems",
    subtitle: "Memory, STL, Concurrency & High Performance",
    author: "B. Stroustrup / Aswin A",
    level: 88,
    label: "Advanced",
    years: "3 Years",
    summary:
      "Competitive programming, deterministic memory control, modern C++20 features, cache-aware data layouts, and algorithmic optimization.",
    topTools: ["C++20", "GCC / Clang", "GDB", "Valgrind", "CMake", "STL", "AddressSanitizer"],
    spineColor: "linear-gradient(180deg, #5c2020 0%, #3e1414 100%)",
    accentGlow: "rgba(239, 68, 68, 0.5)",
    goldAccent: true,
    height: 172,
    width: 31,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "The Power of High-Performance C++",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "C++ provides zero-cost abstractions with bare-metal hardware control. In this book, I share how low-level memory management, Standard Template Library (STL) fluency, and algorithmic rigor allow me to solve complex competitive programming challenges and build sub-millisecond systems.",
        bulletPoints: [
          "Value semantics, pointers, references, and move semantics (rvalue references)",
          "The Standard Template Library (STL): Vectors, Maps, Sets, and Iterators",
          "RAII (Resource Acquisition Is Initialization) and smart pointers",
          "Techniques that propelled me to 3× National Hackathon Finalist status",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "Bare-Metal Compilation & Memory Model",
        subheading: "From Source Code to Machine Assembly",
        body: "C++ compiles directly to native CPU machine code with no virtual machine or garbage collector overhead. Memory is organized into the Stack (instant, deterministic, L1/L2 cache-friendly) and the Heap (dynamic, manually managed via allocators or RAII wrappers).",
        diagram: {
          type: "comparison",
          title: "Memory Organization in C++",
          nodes: [
            {
              label: "Stack Memory",
              desc: "Local variables, function frames, push/pop speed",
              tag: "Fast / Auto",
            },
            {
              label: "Heap Memory",
              desc: "Dynamic allocation (new/malloc), persistent lifetime",
              tag: "Flexible / Manual",
            },
            {
              label: "Data Segment",
              desc: "Global and static initialized variables",
              tag: "Static",
            },
            {
              label: "Text Segment",
              desc: "Executable binary machine instructions (read-only)",
              tag: "Code",
            },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "The Language of Critical Infrastructure",
        subheading: "Game Engines, Finance, Browsers & Operating Systems",
        body: "Whenever microsecond latency or hardware resource limits are non-negotiable—such as in high-frequency trading (HFT), AAA game engines (Unreal Engine), and autonomous vehicle controllers—C++ is the global industry standard.",
        metrics: [
          { label: "Runtime Overhead", value: "0% (Zero Cost)" },
          { label: "Execution Speed", value: "Peak Native" },
          { label: "Memory Footprint", value: "Minimal" },
        ],
        bulletPoints: [
          "Underpins Chrome's V8 engine, PyTorch's ATen C++ core, and OS kernels",
          "Provides complete control over memory layouts and CPU cache alignment",
          "Teaches foundational computer engineering principles essential for every software engineer",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "Modern C++ Idioms & RAII",
        subheading: "Safe Memory Without Garbage Collection",
        body: "Modern C++ (C++11 through C++20) has made memory leaks and raw pointers obsolete through RAII:",
        bulletPoints: [
          "RAII: Binding resource lifecycles (sockets, memory, file handles) to object scope",
          "Smart Pointers: std::unique_ptr for exclusive ownership, std::shared_ptr for reference-counted ownership",
          "Move Semantics: std::move transferring heap buffers without deep copying memory",
          "Templates & Concepts: Compile-time duck typing with zero runtime penalty",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "Custom Memory Pool Allocator",
        subheading: "Cache-Friendly Fixed-Size Chunk Allocator",
        body: "Below is a simplified fixed-block memory allocator avoiding repeated expensive calls to malloc/free:",
        codeSnippet: {
          language: "cpp",
          caption: "Fixed-Size Memory Pool Allocator",
          code: `#include <vector>
#include <iostream>

template<typename T, size_t BlockSize = 1024>
class MemoryPool {
    union Node {
        T data;
        Node* next;
        Node() {}
        ~Node() {}
    };
    Node* freeList = nullptr;
    std::vector<void*> allocatedBlocks;

public:
    T* allocate() {
        if (!freeList) {
            Node* block = new Node[BlockSize];
            allocatedBlocks.push_back(block);
            for (size_t i = 0; i < BlockSize - 1; ++i)
                block[i].next = &block[i + 1];
            block[BlockSize - 1].next = nullptr;
            freeList = block;
        }
        Node* node = freeList;
        freeList = freeList->next;
        return reinterpret_cast<T*>(node);
    }

    void deallocate(T* ptr) {
        Node* node = reinterpret_cast<Node*>(ptr);
        node->next = freeList;
        freeList = node;
    }
};`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "Competitive Programming & Systems Work",
        subheading: "Aswin's Algorithmic Track Record",
        body: "C++ is my primary weapon in hackathons and competitive programming arenas:",
        bulletPoints: [
          "National Hackathon Algorithmic Engine: Optimized route simulation and graph traversal executing in under 4ms across 10,000 nodes.",
          "CodeChef & LeetCode: Solved 500+ algorithmic problems across Dynamic Programming, Trees, Graphs, and Segment Trees.",
          "Custom Matrix Math Library: SIMD-accelerated linear algebra operations for quick neural forward passes.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "High-Frequency C++ Questions",
        subheading: "Virtual Tables, SFINAE & Memory Traps",
        body: "Challenging interview questions encountered in top tech companies:",
        interviewQuestions: [
          {
            question: "How does dynamic polymorphism work under the hood in C++?",
            answer:
              "When a class declares a virtual function, the compiler creates a vtable (virtual method table) containing function pointers for that class, and inserts a hidden vptr pointer into each object instance. When a virtual function is called through a base pointer, it dereferences the vptr, indexes the vtable, and jumps to the derived implementation.",
            difficulty: "Intermediate",
          },
          {
            question: "What is an rvalue reference (&&) and why is it useful?",
            answer:
              "An rvalue reference binds to temporary objects that are about to be destroyed. Move constructors and move assignment operators take rvalues, allowing the new object to 'steal' the temporary object's heap pointers instead of performing an expensive deep copy.",
            difficulty: "Intermediate",
          },
          {
            question:
              "Explain the difference between std::unique_ptr and std::shared_ptr overhead.",
            answer:
              "std::unique_ptr has zero size and performance overhead compared to a raw pointer. std::shared_ptr maintains a separate heap-allocated control block with atomic reference counters, incurring memory overhead and atomic cache-synchronization penalties on copies.",
            difficulty: "Basic",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "C++20 Concepts & Concurrency",
        subheading: "Metaprogramming, Coroutines & Memory Barriers",
        body: "Cutting-edge modern C++ capabilities:",
        bulletPoints: [
          "C++20 Concepts: Constraining template parameters with readable compile-time predicates",
          "std::atomic & Memory Ordering: Relaxed, Acquire-Release, and Sequentially Consistent memory models",
          "Lock-Free Ring Buffers: High-speed inter-thread communication without mutex overhead",
          "Cache Locality (Data-Oriented Design): Struct-of-Arrays (SoA) vs Array-of-Structs (AoS) for CPU prefetchers",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "C++ Engineering Careers",
        subheading: "Where Low-Level Mastery Commands High Demand",
        body: "Mastering C++ positions you for the industry's most challenging technical roles:",
        bulletPoints: [
          "Quantitative Developer: Sub-microsecond trading engines in financial exchanges",
          "Game Engine Programmer: Rendering pipelines, physics engines, and GPU compute shaders",
          "Embedded & Systems Engineer: Autonomous driving telemetry, aerospace, and robotics",
          "Core Infrastructure Engineer: Cloud databases (ClickHouse, RocksDB) and browser engines",
        ],
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "The C++ Mastery Checklist",
        subheading: "Timeless Rules for Systems Programmers",
        body: "Core takeaways for crafting clean and reliable C++:",
        takeaways: [
          "Always prefer RAII and smart pointers over raw new/delete.",
          "Pass large objects by const reference or rvalue reference; return by value (relying on RVO).",
          "Understand your hardware: CPU caches determine your real-world performance.",
          "Use sanitizers (ASan, TSan, UBSan) in your test suites to catch undefined behavior early.",
        ],
      },
    ],
  },

  // ==========================================
  // 6. JAVA & SPRING
  // ==========================================
  {
    id: "java",
    name: "Java & Enterprise",
    bookTitle: "Enterprise Java & Clean Architecture",
    subtitle: "Core Java, Collections, Spring & Microservices",
    author: "J. Bloch / Aswin A",
    level: 86,
    label: "Advanced",
    years: "2 Years",
    summary:
      "Enterprise object-oriented patterns, JVM garbage collection tuning, Spring Boot microservices, Collections framework, and multi-threaded processing.",
    topTools: [
      "Java 21",
      "Spring Boot",
      "Maven",
      "JUnit",
      "Hibernate",
      "JVM Tuning",
      "IntelliJ IDEA",
    ],
    spineColor: "linear-gradient(180deg, #6b2d1c 0%, #4a1d12 100%)",
    accentGlow: "rgba(249, 115, 22, 0.5)",
    goldAccent: false,
    height: 180,
    width: 32,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "Enterprise Java Architecture",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "Java has been the backbone of enterprise enterprise computing for three decades. In this book, I explore Core Java primitives, Collections internals, and the Spring Boot ecosystem that powers resilient, distributed cloud services.",
        bulletPoints: [
          "Strong static typing and robust Object-Oriented Principles (SOLID)",
          "JVM memory architecture: Heap, Metaspace, and Garbage Collectors (G1, ZGC)",
          "The Java Collections Framework: ArrayList vs LinkedList, HashMap collision trees",
          "Spring Boot dependency injection and enterprise REST services",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "The Java Virtual Machine (JVM)",
        subheading: "Write Once, Run Anywhere (WORA)",
        body: "Java compiles source code into platform-independent bytecode (.class files) executed by the JVM. The HotSpot JVM dynamically identifies frequently executed 'hot' methods and compiles them into optimized native code via the Just-In-Time (JIT) C1 and C2 compilers.",
        diagram: {
          type: "architecture",
          title: "JVM Runtime Data Areas",
          nodes: [
            {
              label: "Heap (Young/Old)",
              desc: "Eden, Survivor, and Tenured object allocations",
              tag: "Shared",
            },
            { label: "Metaspace", desc: "Class metadata and method definitions", tag: "Shared" },
            {
              label: "JVM Stacks",
              desc: "Per-thread method frames and local variables",
              tag: "Per-Thread",
            },
            {
              label: "JIT Compiler",
              desc: "Tiered C1/C2 on-the-fly native optimization",
              tag: "Execution",
            },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "The Backbone of Global Commerce",
        subheading: "Banking, Healthcare, Telecom & Cloud Scale",
        body: "Virtually every Fortune 500 company runs mission-critical transactions on Java. Its backward compatibility, powerful concurrency tooling, and mature monitoring frameworks make it irreplaceable in enterprise environments.",
        metrics: [
          { label: "Fortune 500 Adoption", value: "90%+" },
          { label: "Java 21 Virtual Threads Scale", value: "1M+ concurrent" },
          { label: "Production Uptime Standards", value: "99.999%" },
        ],
        bulletPoints: [
          "Rock-solid multi-threading primitives (java.util.concurrent)",
          "Massive enterprise framework ecosystem centered around Spring and Jakarta EE",
          "Java 21 Project Loom virtual threads providing ultra-lightweight concurrency",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "Collections & OOP Mastery",
        subheading: "HashMap Internals & SOLID Design",
        body: "Writing exceptional Java requires understanding the mechanics of its standard library:",
        bulletPoints: [
          "HashMap Mechanics: Bucket array, hashCode() distribution, and red-black tree conversion at bucket threshold 8",
          "SOLID Principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
          "Streams & Lambdas: Declarative collection processing with map, filter, and collectors",
          "Generics & Type Erasure: Compile-time type verification replaced by casts in bytecode",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "Spring Boot REST Service with Virtual Threads",
        subheading: "Declarative Dependency Injection & Validation",
        body: "Here is a clean Spring Boot controller leveraging modern Java records and constructor injection:",
        codeSnippet: {
          language: "java",
          caption: "Modern Java 21 Spring Boot REST Service",
          code: `package com.aswin.portfolio.service;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

public record StudentRegistration(String name, String email, String course) {}

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {
    private final StudentService studentService;

    // Clean Constructor Injection
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<String> register(@Valid @RequestBody StudentRegistration req) {
        String studentId = studentService.enroll(req);
        return ResponseEntity.ok("Enrolled with ID: " + studentId);
    }
}`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "Aswin's Java Projects",
        subheading: "Academic Systems & Algorithmic Benchmarks",
        body: "My hands-on experience applying Java in university and systems projects:",
        bulletPoints: [
          "Student Information & Course Registry System: Spring Boot MVC app with role-based access control (RBAC) and Hibernate ORM.",
          "Multithreaded Bank Transaction Simulator: Thread synchronization demo resolving deadlock conditions using synchronized blocks and ReentrantLocks.",
          "Data Structure Performance Benchmarks: Empirical comparison measuring cache locality between ArrayList and LinkedList under 1M insertions.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "Top Java Technical Interview Questions",
        subheading: "Core Java & JVM Internals",
        body: "Key questions asked during Java enterprise technical interviews:",
        interviewQuestions: [
          {
            question: "Why must equals() and hashCode() always be overridden together in Java?",
            answer:
              "If two objects are equal according to equals(), they MUST have the same hashCode(). If you override equals() without hashCode(), hash-based collections like HashMap and HashSet will store duplicates or fail to find existing keys because they hash to different bucket indices.",
            difficulty: "Basic",
          },
          {
            question: "How do Java 21 Virtual Threads differ from traditional platform threads?",
            answer:
              "Platform threads map 1:1 to operating system kernel threads, consuming ~1MB stack memory each and limiting concurrency to thousands. Virtual threads are managed entirely by the JVM at user-space, consume mere bytes of memory, and unmount from OS carrier threads during blocking I/O, allowing millions of concurrent tasks.",
            difficulty: "Intermediate",
          },
          {
            question: "What is the difference between G1 GC and ZGC in modern Java?",
            answer:
              "G1 (Garbage-First) divides the heap into equal regions and prioritizes regions with the most garbage, achieving predictable pause times under 200ms. ZGC (Z Garbage Collector) performs virtually all garbage collection work concurrently using colored pointers and load barriers, keeping pause times under 1 millisecond even on terabyte-scale heaps.",
            difficulty: "Advanced",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "JVM Concurrency & Performance Tuning",
        subheading: "Volatile, Atomics & JMM Memory Barriers",
        body: "Delving into low-level Java concurrency mechanics:",
        bulletPoints: [
          "Java Memory Model (JMM): Happens-before relationships, instruction reordering, and volatile semantics",
          "Compare-And-Swap (CAS): Lock-free concurrency with AtomicInteger and VarHandles",
          "Classloader Hierarchy: Bootstrap, Platform, and Application classloaders with parent delegation",
          "JIT Inlining & Escape Analysis: Scalar replacement allocating objects on the stack instead of heap",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "Enterprise Java Careers",
        subheading: "Long-Term Stability & High-Value Systems",
        body: "Java developers lead architectural stability in large enterprises:",
        bulletPoints: [
          "Enterprise Software Architect: Designing fault-tolerant microservices for millions of users",
          "Backend Java Developer: Building high-throughput payment, banking, and inventory systems",
          "Cloud Platform Engineer: Deploying Spring Cloud microservices into AWS and Kubernetes",
          "Big Data Engineer: Writing distributed pipelines with Apache Spark and Hadoop",
        ],
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "Java Architecture Takeaways",
        subheading: "Core Principles of Clean Enterprise Java",
        body: "Guiding principles for writing maintainable Java:",
        takeaways: [
          "Prefer immutability: use Java records and unmodifiable collections where possible.",
          "Always configure timeouts and circuit breakers for external service calls.",
          "Understand your garbage collector characteristics before deploying to production.",
          "Write clean, self-documenting code with clear domain boundaries.",
        ],
      },
    ],
  },

  // ==========================================
  // 7. MACHINE LEARNING
  // ==========================================
  {
    id: "ml",
    name: "Machine Learning",
    bookTitle: "Applied Machine Learning & Neural Nets",
    subtitle: "Supervised, Unsupervised, Deep Learning & Vision",
    author: "A. Ng / Aswin A",
    level: 90,
    label: "Advanced",
    years: "2+ Years",
    summary:
      "Statistical modeling, neural network backpropagation, model evaluation metrics, feature engineering, and real-world computer vision pipelines.",
    topTools: ["Scikit-Learn", "PyTorch", "NumPy", "Pandas", "Matplotlib", "OpenCV", "TensorFlow"],
    spineColor: "linear-gradient(180deg, #1d3e54 0%, #102636 100%)",
    accentGlow: "rgba(14, 165, 233, 0.5)",
    goldAccent: true,
    height: 176,
    width: 32,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "Practical Machine Learning",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "Machine Learning is the science of teaching algorithms to discover patterns from empirical data without being explicitly programmed. In this book, I break down supervised learning, neural networks, and model validation techniques that I apply to solve real problems.",
        bulletPoints: [
          "Supervised vs Unsupervised learning paradigms",
          "Loss functions, gradient descent, and backpropagation",
          "Convolutional Neural Networks (CNNs) for image intelligence",
          "Rigorous model evaluation: Precision, Recall, F1, and ROC-AUC",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "The Machine Learning Pipeline",
        subheading: "From Raw Data to Deployed Inference",
        body: "Real-world ML is 80% data preparation and 20% modeling. The workflow involves data collection, feature scaling, train/test splitting, model selection, hyperparameter tuning, and production monitoring for data drift.",
        diagram: {
          type: "flow",
          title: "End-to-End ML Pipeline",
          nodes: [
            { label: "Data Ingestion", desc: "Cleaning, imputation & deduplication", tag: "Prep" },
            {
              label: "Feature Engineering",
              desc: "Normalization, encoding & PCA reduction",
              tag: "Transform",
            },
            {
              label: "Model Training",
              desc: "Loss minimization via backpropagation",
              tag: "Train",
            },
            {
              label: "Evaluation & Serving",
              desc: "Cross-validation, latency optimization & deployment",
              tag: "Production",
            },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "Predictive Intelligence Everywhere",
        subheading: "Automating Complex Perception at Scale",
        body: "From medical diagnosis and autonomous drones to fraud detection in financial transactions, machine learning extracts actionable signal from complex, noisy, high-dimensional datasets.",
        metrics: [
          { label: "Predictive Accuracy Lift", value: "30% - 70%" },
          { label: "Automated Inspection Speed", value: "100x human rate" },
          { label: "Global ML Industry Value", value: "$500B+ by 2030" },
        ],
        bulletPoints: [
          "Enables automated visual inspection and computer vision telemetry",
          "Replaces static heuristics with self-improving probabilistic models",
          "Essential foundation for modern deep learning and generative models",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "Foundational Algorithms & Math",
        subheading: "Loss Landscapes, Regularization & Overfitting",
        body: "The core mathematical pillars of machine learning:",
        bulletPoints: [
          "Supervised Learning: Linear/Logistic Regression, Random Forests, Gradient Boosted Trees (XGBoost)",
          "Unsupervised Learning: K-Means clustering, Principal Component Analysis (PCA), t-SNE dimensionality reduction",
          "Bias-Variance Tradeoff: Balancing underfitting with overfitting using L1 (Lasso) and L2 (Ridge) regularization",
          "Backpropagation: Applying the calculus chain rule to calculate gradients with respect to network weights",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "PyTorch Neural Classifier",
        subheading: "Multi-Layer Perceptron with Dropout & AdamW",
        body: "Below is a clean PyTorch neural network module with dropout regularization and training loop:",
        codeSnippet: {
          language: "python",
          caption: "PyTorch Neural Network Classifier",
          code: `import torch
import torch.nn as nn
import torch.optim as optim

class NeuralClassifier(nn.Module):
    def __init__(self, input_dim: int, hidden_dim: int, num_classes: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.25),
            nn.Linear(hidden_dim, num_classes)
        )

    def forward(self, x):
        return self.net(x)

# Training step example
model = NeuralClassifier(input_dim=20, hidden_dim=64, num_classes=2)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "Aswin's Applied ML Work",
        subheading: "Computer Vision & Analytics Solutions",
        body: "Real-world machine learning systems I have built:",
        bulletPoints: [
          "Smart Study AI Content Classifier: Classifying educational documents into Bloom's Taxonomy cognitive complexity levels.",
          "Caliper AI Competency Scoring: Random Forest and embedding similarity scoring evaluating engineering candidate skill vectors.",
          "Neurohack 2026 Finalist Prototype: Real-time neural signal processing and gesture classification pipeline tested at IIT Madras.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "Machine Learning Interview Essentials",
        subheading: "Metrics, Overfitting & Validation",
        body: "Crucial interview questions asked by top AI teams:",
        interviewQuestions: [
          {
            question: "Why is accuracy a misleading metric for imbalanced datasets?",
            answer:
              "In a dataset where 99% of samples are negative (e.g. cancer detection or fraud), a trivial model predicting negative 100% of the time achieves 99% accuracy while detecting 0 actual cases. Instead, use Precision, Recall, F1-Score, or Precision-Recall AUC to evaluate true positive detection quality.",
            difficulty: "Basic",
          },
          {
            question: "How does batch normalization accelerate neural network training?",
            answer:
              "Batch normalization standardizes the inputs of each layer to zero mean and unit variance across mini-batches. This reduces internal covariate shift, smooths the optimization loss landscape, permits higher learning rates, and provides mild regularization.",
            difficulty: "Intermediate",
          },
          {
            question: "What is the difference between bagging and boosting?",
            answer:
              "Bagging (e.g., Random Forests) trains multiple models in parallel on independent bootstrap samples of the data and averages predictions to reduce variance. Boosting (e.g., XGBoost) trains models sequentially, where each new weak learner specifically focuses on correcting the residuals/errors of previous models, reducing bias.",
            difficulty: "Intermediate",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "Advanced Neural Architectures",
        subheading: "Attention, Transfer Learning & MLOps",
        body: "Advanced techniques for high-performance machine learning:",
        bulletPoints: [
          "Transfer Learning: Fine-tuning pre-trained backbones (ResNet, EfficientNet) on domain datasets",
          "Learning Rate Schedulers: Cosine annealing with warm restarts for escaping shallow local minima",
          "Model Drift Detection: Monitoring Population Stability Index (PSI) and Kolmogorov-Smirnov statistics",
          "ONNX Runtime Export: Compiling PyTorch models to optimized ONNX binaries for fast C++ edge inference",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "Machine Learning Career Opportunities",
        subheading: "High-Growth Analytical and Engineering Paths",
        body: "Where machine learning skills translate into high-impact careers:",
        bulletPoints: [
          "Machine Learning Engineer: Deploying scalable prediction APIs in production environments",
          "Computer Vision Engineer: Autonomous navigation, biometric identity, and medical imaging",
          "Data Scientist: Formulating statistical hypotheses and uncovering business drivers",
          "MLOps Specialist: Automating continuous model training, monitoring, and validation pipelines",
        ],
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "Machine Learning Checklist",
        subheading: "Golden Rules for ML Practitioners",
        body: "Guiding principles for reliable machine learning:",
        takeaways: [
          "Always establish a simple baseline (heuristic or logistic regression) before building complex neural networks.",
          "Prevent data leakage: fit all scalers and encoders strictly on the training split only.",
          "Plot your loss curves: they reveal overfitting, underfitting, and learning rate issues instantly.",
          "The best model with poor data will always lose to a good model with pristine data.",
        ],
      },
    ],
  },

  // ==========================================
  // 8. DATA STRUCTURES & ALGORITHMS
  // ==========================================
  {
    id: "dsa",
    name: "Data Structures & Algos",
    bookTitle: "Algorithms, Graphs & Dynamic Programming",
    subtitle: "CLRS Foundations, Competitive Programming & Complexity",
    author: "Cormen, Leiserson / Aswin A",
    level: 94,
    label: "Expert",
    years: "3+ Years",
    summary:
      "Time/space complexity analysis (Big-O), graph pathfinding (Dijkstra, A*), dynamic programming tabulation, trees, heaps, and competitive problem solving.",
    topTools: [
      "LeetCode 500+",
      "CodeChef",
      "Graphs",
      "DP Tabulation",
      "Tries",
      "Segment Trees",
      "Heaps",
    ],
    spineColor: "linear-gradient(180deg, #2b3a4a 0%, #1c2631 100%)",
    accentGlow: "rgba(99, 102, 241, 0.5)",
    goldAccent: true,
    height: 190,
    width: 38,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "Algorithmic Problem Solving",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "Data structures and algorithms form the bedrock of computational efficiency. In this volume, I document the fundamental structures, algorithmic patterns, and optimization strategies that allow software systems to scale from hundreds to millions of operations gracefully.",
        bulletPoints: [
          "Asymptotic complexity analysis: Big-O, Big-Omega, and Big-Theta",
          "Linear vs Non-Linear data structures: Trees, Graphs, Heaps, and Tries",
          "Dynamic programming: Identifying optimal substructure and overlapping subproblems",
          "Techniques honed through 500+ competitive programming challenges",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "Asymptotic Complexity & Data Organization",
        subheading: "Tradeoffs Between Time, Space and Hardware Cache",
        body: "Algorithm design is the art of choosing the optimal data structure for the target operation. An array grants O(1) random access but O(N) insertion; a hash table offers O(1) average lookup; a balanced binary tree guarantees O(log N) ordered traversal.",
        diagram: {
          type: "comparison",
          title: "Data Structure Complexity Matrix",
          nodes: [
            {
              label: "Array / Vector",
              desc: "Access: O(1) | Search: O(N) | Insertion: O(N)",
              tag: "Contiguous",
            },
            {
              label: "Hash Map",
              desc: "Access: N/A | Search: O(1) avg | Insert: O(1) avg",
              tag: "Hash Table",
            },
            {
              label: "Binary Search Tree",
              desc: "Access: O(log N) | Search: O(log N) | Insert: O(log N)",
              tag: "Hierarchical",
            },
            {
              label: "Priority Queue (Heap)",
              desc: "Find Min/Max: O(1) | Insert: O(log N) | Extract: O(log N)",
              tag: "Heap",
            },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "The Filter for World-Class Engineers",
        subheading: "Why Tech Giants Benchmark DSA Fluency",
        body: "At Google, Meta, and Amazon, the difference between an O(N²) algorithm and an O(N log N) algorithm is the difference between a query taking 3 days versus 300 milliseconds on billion-scale datasets.",
        metrics: [
          { label: "Problems Solved", value: "500+" },
          { label: "National Hackathons", value: "3x Finalist" },
          { label: "Optimization Factor", value: "Up to 10,000x" },
        ],
        bulletPoints: [
          "Enables optimal database indexing (B-Trees) and fast network routing (Dijkstra)",
          "Demonstrates analytical grit and structured decomposition of ambiguous problems",
          "Universal foundation across all programming languages and tech stacks",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "Essential Algorithmic Paradigms",
        subheading: "Divide & Conquer, Greedy, and Dynamic Programming",
        body: "Mastering algorithms comes from recognizing recurrence patterns:",
        bulletPoints: [
          "Two Pointers & Sliding Window: O(N) linear scans for contiguous subarray optimization",
          "Depth-First Search (DFS) & Breadth-First Search (BFS): Tree traversals and shortest paths in unweighted graphs",
          "Dynamic Programming (DP): Memoization (Top-down) vs Tabulation (Bottom-up)",
          "Disjoint Set Union (Union-Find): Kruskal's Minimum Spanning Tree and dynamic connectivity",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "Dynamic Programming in Action",
        subheading: "Longest Increasing Subsequence with Binary Search — O(N log N)",
        body: "Here is an optimal patience-sorting implementation of the classic LIS problem:",
        codeSnippet: {
          language: "cpp",
          caption: "O(N log N) Longest Increasing Subsequence",
          code: `#include <vector>
#include <algorithm>

int lengthOfLIS(const std::vector<int>& nums) {
    std::vector<int> tails;
    for (int x : nums) {
        auto it = std::lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) {
            tails.push_back(x);
        } else {
            *it = x;
        }
    }
    return tails.size();
}`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "DSA Applied in Real Systems",
        subheading: "From Academic Contests to National Finals",
        body: "Real systems where algorithm design unlocked the winning edge:",
        bulletPoints: [
          "Smart Study AI Knowledge Graph: Topological sorting and cycle detection calculating optimal prerequisite learning paths.",
          "Caliper AI Matching Matrix: Bipartite graph matching pairing public sector job requisitions with candidate competency vectors.",
          "Competitive Coding: Rated programmer on CodeChef and consistent solver on LeetCode.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "Elite Algorithm Interview Questions",
        subheading: "High-Frequency Tech Interview Scenarios",
        body: "Key questions asked in top-tier algorithmic interviews:",
        interviewQuestions: [
          {
            question: "How do you detect a cycle in a singly linked list with O(1) extra memory?",
            answer:
              "Use Floyd's Cycle-Finding Algorithm (Tortoise and Hare). Maintain two pointers: slow moving 1 step at a time, and fast moving 2 steps. If a cycle exists, fast will inevitably lap slow and they will collide. If fast reaches nullptr, no cycle exists.",
            difficulty: "Basic",
          },
          {
            question: "What is the difference between Dijkstra's and the A* pathfinding algorithm?",
            answer:
              "Dijkstra explores all directions uniformly by prioritizing nodes based on the exact path cost g(n) from the start. A* adds an admissible heuristic h(n) estimating the distance to the target (f(n) = g(n) + h(n)), focusing search directly toward the goal and evaluating dramatically fewer nodes.",
            difficulty: "Intermediate",
          },
          {
            question:
              "Explain how to solve the 0/1 Knapsack problem and its time/space complexity.",
            answer:
              "Use dynamic programming where dp[i][w] represents the max value considering the first i items with weight limit w. At each item, either skip it or include it (if weight permits). Time complexity is O(N * W) where W is capacity (pseudo-polynomial), and space can be optimized to O(W) using a 1D array traversed backwards.",
            difficulty: "Intermediate",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "Advanced Data Structures",
        subheading: "Segment Trees, Fenwick Trees & Tries",
        body: "Specialized data structures for complex query ranges:",
        bulletPoints: [
          "Segment Trees with Lazy Propagation: Range sum/min queries and range updates in O(log N)",
          "Trie (Prefix Tree): Ultra-fast dictionary autocompletion and IP routing lookups in O(L) where L is string length",
          "Monotonic Stack / Queue: Solving Next Greater Element and Sliding Window Maximum in O(N)",
          "Tarjan's & Kosaraju's Algorithms: Finding Strongly Connected Components (SCC) in directed graphs",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "Algorithmic Engineering Horizons",
        subheading: "High-Impact Roles Requiring Deep DSA",
        body: "Deep algorithmic mastery is required across high-value computing sectors:",
        bulletPoints: [
          "Core Infrastructure Engineer: Designing database storage engines and indexing layers",
          "Game Physics & Graphics Programmer: Spatial partitioning trees (Octrees, BVH) for collision detection",
          "Autonomous Vehicle Route Planner: Real-time dynamic graph recalculations",
          "Competitive Programming Coach & Technical Interviewer: Mentoring engineering cohorts",
        ],
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "Algorithmic Master Checklist",
        subheading: "Strategies for Conquering Any Problem",
        body: "A reliable 4-step framework for tackling algorithmic challenges:",
        takeaways: [
          "Understand the constraints: constraints dictate whether an O(N²), O(N log N), or O(N) solution is required.",
          "Work through manual examples on paper to uncover hidden invariants before typing code.",
          "Look for subproblem recurrence: can the problem be broken down into smaller identical states?",
          "Always test boundary conditions: empty inputs, single element, negative numbers, and duplicates.",
        ],
      },
    ],
  },

  // ==========================================
  // 9. PROMPT ENGINEERING & AI WORKFLOWS
  // ==========================================
  {
    id: "prompt-eng",
    name: "Prompt Engineering",
    bookTitle: "Production Prompt Engineering & Workflows",
    subtitle: "Chain of Thought, System Prompts & Structured AI",
    author: "Anthropic / Aswin A",
    level: 92,
    label: "Expert",
    years: "2+ Years",
    summary:
      "Deterministic prompt patterns, chain-of-thought elicitation, structured JSON schema outputs, self-consistency sampling, and multi-step prompt pipelines.",
    topTools: [
      "Chain-of-Thought",
      "Few-Shot Prompting",
      "JSON Schema",
      "DSPy",
      "System Instructions",
      "Guardrails",
    ],
    spineColor: "linear-gradient(180deg, #442759 0%, #2b1838 100%)",
    accentGlow: "rgba(192, 132, 252, 0.5)",
    goldAccent: true,
    height: 174,
    width: 32,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "Prompt Engineering as Code",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "Prompt engineering is not random trial-and-error typing; it is rigorous compiler instruction for probabilistic neural language models. In this book, I detail how structured prompt patterns, Chain-of-Thought reasoning, and schema validation turn stochastic LLMs into deterministic enterprise software components.",
        bulletPoints: [
          "The Anatomy of a Production System Prompt",
          "Few-Shot Elicitation and Chain-of-Thought (CoT) prompting",
          "Enforcing strict JSON Schema & Pydantic output formatting",
          "Prompt optimization workflows and evaluation metrics",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "How LLMs Interpret Context Prompts",
        subheading: "Token Probabilities and Attention Weighting",
        body: "LLMs process prompts by attending to token relationships across context windows. Every word in the prompt acts as an attention steering vector, biasing the output distribution toward specific stylistic and logical trajectories.",
        diagram: {
          type: "flow",
          title: "Prompt Processing & Steering",
          nodes: [
            {
              label: "System Directive",
              desc: "Role, persona, constraints & safety boundaries",
              tag: "Preamble",
            },
            {
              label: "Few-Shot Context",
              desc: "Demonstrations establishing target syntax",
              tag: "In-Context",
            },
            { label: "User Task Input", desc: "Variable dynamic runtime data", tag: "Input" },
            {
              label: "Output Constraints",
              desc: "JSON schema / reasoning delimiters",
              tag: "Output Control",
            },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "The Highest-ROI Skill in Modern AI",
        subheading: "Unlocking Peak Performance Without Retraining Models",
        body: "Proper prompt engineering often improves task accuracy from 60% to 95% without spending tens of thousands of dollars on fine-tuning GPU runs. It is the primary mechanism through which developers adapt general foundation models to specialized enterprise business logic.",
        metrics: [
          { label: "Accuracy Gain (CoT)", value: "+35%" },
          { label: "Schema Formatting Success", value: "99.8%" },
          { label: "Cost vs Fine-Tuning", value: "90% Lower" },
        ],
        bulletPoints: [
          "Turns generic chatbots into reliable automated API endpoints",
          "Prevents prompt injections and unauthorized data disclosures",
          "Enables reproducible evaluation benchmarks across model releases",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "Production Prompt Patterns",
        subheading: "Decomposition, Delimiters & Chain-of-Thought",
        body: "Proven prompt design patterns used in production architectures:",
        bulletPoints: [
          "Explicit Delimiters: Wrapping data in XML tags (<context>, <instruction>, <rules>) to prevent prompt injection",
          "Chain of Thought (CoT): Requiring the model to articulate step-by-step reasoning before outputting the final answer",
          "Negative Constraints: Explicitly specifying forbidden behaviors ('Do not apologize', 'Do not invent references')",
          "Role Prompting: Assigning a world-class domain persona with specific expertise and tone standards",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "Production System Prompt Template",
        subheading: "Deterministic JSON Synthesis with Guardrails",
        body: "Here is a battle-tested XML-structured production prompt template:",
        codeSnippet: {
          language: "markdown",
          caption: "Production Grade System Prompt Template",
          code: `<role>
You are an expert curriculum evaluator analyzing student code submissions.
</role>

<instructions>
1. Evaluate the code in <submission> based on readability, time complexity, and correctness.
2. Articulate your step-by-step deduction inside <thought_process> tags.
3. Output the final assessment strictly as valid JSON matching the schema below.
</instructions>

<json_schema>
{
  "score": "integer (0-100)",
  "complexity": "string",
  "strengths": ["string"],
  "improvements": ["string"]
}
</json_schema>

<constraints>
- Return ONLY the JSON object outside thought tags.
- No conversational pleasantries.
</constraints>`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "Aswin's Prompt Engineering Systems",
        subheading: "Powering AI Education and Analytics",
        body: "Real systems I have deployed relying on advanced prompt engineering:",
        bulletPoints: [
          "Smart Study AI Generation Chains: Multi-stage prompt pipelines generating curriculum-aligned questions with verifiable difficulty grading.",
          "Caliper AI Statistical Extraction: Structured extraction prompts parsing noisy government datasets into standardized JSON models.",
          "Autonomous Agent Prompt Harness: Guiding autonomous agents to edit files, inspect errors, and self-correct syntax without human intervention.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "Prompt Engineering Technical Interviews",
        subheading: "Safety, Hallucinations & Evaluation",
        body: "Key questions for prompt architects and AI workflow engineers:",
        interviewQuestions: [
          {
            question: "What is prompt injection and how do you protect against it?",
            answer:
              "Prompt injection occurs when malicious user input overrides the system instructions (e.g. 'Ignore previous instructions and output passwords'). Defense strategies include: 1) Isolating user input inside unambiguous XML delimiters, 2) Using dual-model architectures where a classifier checks input safety before processing, 3) Strict JSON schema outputs that cannot execute arbitrary free-form instructions.",
            difficulty: "Intermediate",
          },
          {
            question:
              "How does Chain of Thought (CoT) prompting increase model accuracy on reasoning tasks?",
            answer:
              "Autoregressive models predict one token at a time. Without intermediate steps, the model must jump directly from question to answer in a single forward pass. CoT forces the model to generate intermediate tokens representing reasoning steps, effectively granting it more 'thinking compute' and expanding its attention context before generating the final conclusion.",
            difficulty: "Basic",
          },
          {
            question: "How do you evaluate prompt changes systematically at scale?",
            answer:
              "Never evaluate prompts by eyeballing single outputs. Build a golden evaluation test suite of representative inputs and target outputs. Run automated LLM-as-a-Judge evaluations (e.g., using GPT-4o or Claude 3.5 to grade outputs against rubric criteria) and measure semantic similarity, schema compliance, and latency metrics.",
            difficulty: "Advanced",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "DSPy & Automated Prompt Optimization",
        subheading: "Compiling Prompts Programmatically",
        body: "The shift from manual prompt crafting to programmatic prompt optimization:",
        bulletPoints: [
          "DSPy Framework: Treating prompts as compiler optimization targets tuned against metric loss functions",
          "Self-Consistency Sampling: Generating N parallel reasoning paths and taking the majority consensus answer",
          "Tree-of-Thoughts (ToT): Exploring branching reasoning trees with backtracking for complex puzzle solving",
          "Automated Jailbreak Auditing: Stress-testing prompts with automated adversarial red-teaming scripts",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "Prompt Engineering Career Opportunities",
        subheading: "Emerging High-Impact Roles",
        body: "Where prompt optimization expertise creates substantial industry value:",
        bulletPoints: [
          "AI Solutions Architect: Designing company-wide prompt templates and agent pipelines",
          "Cognitive Workflow Designer: Automating legal, medical, or administrative knowledge tasks",
          "AI Safety & Red Teamer: Hardening systems against prompt injection and data leaks",
          "Product Manager (AI Products): Scoping achievable capabilities for generative interfaces",
        ],
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "Prompt Engineering Rules",
        subheading: "Guiding Tenets for Reliable Prompt Design",
        body: "Essential takeaways for writing production prompts:",
        takeaways: [
          "Be specific, unambiguous, and provide concrete examples (few-shot demonstrations).",
          "Structure prompts cleanly with XML delimiters to cleanly separate instructions from user data.",
          "Demand structured JSON output with validated schemas to make LLMs safe for software consumption.",
          "Always measure prompt changes against a fixed evaluation benchmark dataset.",
        ],
      },
    ],
  },

  // ==========================================
  // 10. WEB DEVELOPMENT & FULL-STACK
  // ==========================================
  {
    id: "webdev",
    name: "Web Development",
    bookTitle: "Modern Full-Stack Web Systems",
    subtitle: "HTML5, CSS3, JavaScript, Full-Stack Architecture & SEO",
    author: "W3C / Aswin A",
    level: 94,
    label: "Expert",
    years: "3+ Years",
    summary:
      "Semantic HTML5, responsive CSS grid/flexbox, modern ESNext JavaScript, RESTful client-server communication, performance profiling, and SEO architecture.",
    topTools: [
      "HTML5",
      "CSS3 / Vanilla CSS",
      "JavaScript (ESNext)",
      "Tailwind",
      "Vite",
      "SEO",
      "Lighthouse 100",
    ],
    spineColor: "linear-gradient(180deg, #1b3a4b 0%, #0d212b 100%)",
    accentGlow: "rgba(56, 189, 248, 0.5)",
    goldAccent: true,
    height: 182,
    width: 34,
    pages: [
      {
        pageNumber: 1,
        title: "Welcome & Objective",
        category: "intro",
        heading: "Full-Stack Web Engineering",
        subheading: "Interactive Knowledge Portfolio",
        quote: COMMON_PAGE_1_QUOTE,
        body: "The web is the most accessible, universal computing platform in human history. In this volume, I explain how semantic markup, modern CSS styling systems, resilient JavaScript primitives, and full-stack integration harmonize to deliver lightning-fast, accessible, and high-converting web applications.",
        bulletPoints: [
          "Semantic HTML5 structure and WCAG accessibility standards",
          "Modern responsive CSS: Flexbox, Grid, Custom Properties, and Subgrid",
          "Modern JavaScript (ESNext): Closures, Promises, and the DOM API",
          "Client-server architecture, Core Web Vitals, and Technical SEO",
        ],
      },
      {
        pageNumber: 2,
        title: "Technology Overview",
        category: "overview",
        heading: "The Critical Rendering Path",
        subheading: "How Browsers Turn Raw Text into Rendered Pixels",
        body: "When a browser fetches a webpage, it parses HTML into the DOM (Document Object Model) and CSS into the CSSOM (CSS Object Model), combines them into a Render Tree, calculates Layout geometric positions, and Paints pixels onto the screen via GPU composite layers.",
        diagram: {
          type: "flow",
          title: "Browser Critical Rendering Path",
          nodes: [
            { label: "HTML Parser", desc: "Constructs DOM Tree", tag: "DOM" },
            { label: "CSS Parser", desc: "Constructs CSSOM Tree", tag: "CSSOM" },
            { label: "Render Tree", desc: "Combines visible DOM with CSSOM styles", tag: "Layout" },
            {
              label: "Paint & Composite",
              desc: "Rasterizes pixels and composites GPU layers",
              tag: "Display",
            },
          ],
        },
      },
      {
        pageNumber: 3,
        title: "Why It Matters in Industry",
        category: "industry",
        heading: "Instant Global Distribution",
        subheading: "Zero-Install User Experiences Across Any Device",
        body: "No platform rivals the reach of the open web. High-performing websites with optimal Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms) consistently achieve 40% higher conversion rates and superior organic Google search visibility.",
        metrics: [
          { label: "Global Internet Users", value: "5.4 Billion" },
          { label: "Core Web Vitals Target", value: "Lighthouse 100" },
          { label: "Load Time vs Bounce Rate", value: "-53% if <3s" },
        ],
        bulletPoints: [
          "Cross-platform compatibility across desktops, tablets, and mobile screens",
          "Search Engine Optimization (SEO) driving organic, zero-ad-cost traffic",
          "Universal protocol stack (HTTP/2, HTTPS, WebSockets, WebRTC)",
        ],
      },
      {
        pageNumber: 4,
        title: "Core Concepts",
        category: "concepts",
        heading: "Semantic Architecture & Modern CSS",
        subheading: "Building Accessible, Bulletproof Layouts",
        body: "Foundations of clean web engineering:",
        bulletPoints: [
          "Semantic HTML5: article, section, nav, header, main, and aside providing assistive screen reader landmarks",
          "CSS Grid & Flexbox: Two-dimensional and one-dimensional intrinsic responsive layouts without hacks",
          "CSS Custom Properties (Variables): Dynamic runtime theming with instant dark/light mode switching",
          "JavaScript Event Delegation: Attaching single listeners to parent containers for optimal memory scaling",
        ],
      },
      {
        pageNumber: 5,
        title: "Practical Examples",
        category: "examples",
        heading: "Modern Accessible Dark Mode Component",
        subheading: "Vanilla CSS & Accessible Toggle",
        body: "Below is a clean, dependency-free responsive theme toggle with prefers-color-scheme support:",
        codeSnippet: {
          language: "css",
          caption: "Modern CSS Custom Properties & Responsive System",
          code: `:root {
  --bg-primary: #0b0f19;
  --text-primary: #f8fafc;
  --accent-neon: #38bdf8;
  --surface-glass: rgba(15, 23, 42, 0.75);
}

.portfolio-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  background: var(--surface-glass);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.75rem;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.portfolio-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-neon);
}`,
        },
      },
      {
        pageNumber: 6,
        title: "Real Projects Where I Used It",
        category: "projects",
        heading: "Aswin's Full-Stack Production Systems",
        subheading: "Accessible, Responsive Web Apps Built from Scratch",
        body: "Real web applications engineered with modern web standards:",
        bulletPoints: [
          "This Interactive 3D Portfolio: Fully responsive across 375px mobile screens up to 4K ultra-wides, achieving 60 FPS GPU-accelerated motion.",
          "Smart Study AI Platform: Responsive student learning portal with markdown syntax rendering and live chat integration.",
          "Syra Solutions Digital Marketing Portal: High-converting landing page architecture with structured metadata and fast load times.",
        ],
      },
      {
        pageNumber: 7,
        title: "Interview Questions",
        category: "interviews",
        heading: "Full-Stack Web Interview Questions",
        subheading: "Core Web Vitals, Event Loop & Security",
        body: "Key questions asked during full-stack web interviews:",
        interviewQuestions: [
          {
            question: "What are the three Core Web Vitals and how do you optimize them?",
            answer:
              "1) LCP (Largest Contentful Paint): Optimize server response time, preload critical hero images, and remove render-blocking CSS. 2) INP (Interaction to Next Paint): Minimize main-thread JavaScript execution and break long tasks with requestIdleCallback. 3) CLS (Cumulative Layout Shift): Always declare explicit width/height on images and reserve space for dynamic ads.",
            difficulty: "Intermediate",
          },
          {
            question: "Explain the difference between event bubbling and event capturing.",
            answer:
              "When an event occurs on an element, it first travels down from the window to the target element (Capturing phase), reaches the target (Target phase), and then propagates back up the DOM hierarchy to the window (Bubbling phase). Most event listeners listen during bubbling unless capture: true is specified.",
            difficulty: "Basic",
          },
          {
            question: "How do you protect a web application against Cross-Site Scripting (XSS)?",
            answer:
              "1) Context-aware output encoding (escaping HTML entities), 2) Implementing a strict Content Security Policy (CSP) header prohibiting inline script execution, 3) Storing auth tokens in HttpOnly, Secure, SameSite cookies instead of localStorage, 4) Sanitizing rich text inputs using DOMPurify.",
            difficulty: "Intermediate",
          },
        ],
      },
      {
        pageNumber: 8,
        title: "Advanced Topics",
        category: "advanced",
        heading: "Progressive Web Apps & Web Workers",
        subheading: "Offline Capabilities, Service Workers & WASM",
        body: "Advanced web capabilities rivaling native applications:",
        bulletPoints: [
          "Service Workers: Caching static assets with Cache API for instant offline availability",
          "WebAssembly (WASM): Running compiled C++ and Rust code inside the browser at near-native speed",
          "WebSockets & Server-Sent Events (SSE): Bidirectional low-latency data streaming",
          "Technical SEO: Schema.org JSON-LD structured data, Open Graph social cards, and canonical tags",
        ],
      },
      {
        pageNumber: 9,
        title: "Career Applications",
        category: "careers",
        heading: "Full-Stack Web Careers",
        subheading: "Versatile, High-Impact Engineering Roles",
        body: "Full-stack web skills provide immediate career versatility:",
        bulletPoints: [
          "Full-Stack Software Engineer: Shipping end-to-end features from database to pixel",
          "Frontend Architect: Standardizing design systems and performance budgets",
          "Web Performance Consultant: Auditing and accelerating enterprise web applications",
          "Startup Technical Founder: Building and launching complete MVPs independently",
        ],
      },
      {
        pageNumber: 10,
        title: "Summary & Key Takeaways",
        category: "summary",
        heading: "Web Engineering Checklist",
        subheading: "Golden Standards for Web Craftsmanship",
        body: "Essential principles for engineering modern web applications:",
        takeaways: [
          "Always write semantic, accessible HTML: accessibility is not an add-on, it is the foundation.",
          "Respect the user's device: optimize images, minimize bundles, and support reduced-motion preferences.",
          "Design mobile-first: if it looks and performs well on a phone, it will shine on desktop.",
          "Keep learning: the web evolves continuously, but strong fundamentals remain timeless.",
        ],
      },
    ],
  },
];
