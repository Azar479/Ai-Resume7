import { PresetScenario } from './types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'staff-platform-ai',
    label: 'Senior Full-Stack → Staff Platform & AI Engineer',
    role: 'Staff Platform Engineer, AI Infrastructure',
    candidateName: 'Alex Rivera',
    candidateContact: 'alex.rivera.tech@gmail.com · (415) 890-4321 · San Francisco, CA · github.com/arivera · linkedin.com/in/alex-rivera-dev',
    resumeText: `Alex Rivera
Senior Software Engineer
San Francisco, CA | alex.rivera.tech@gmail.com | (415) 890-4321

PROFESSIONAL SUMMARY
Senior Software Engineer with 6+ years of experience designing high-scale web platforms and backend services. Proficient in TypeScript, Node.js, Python, PostgreSQL, and AWS. Proven track record leading distributed system initiatives and optimizing microservice latency.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, Go, SQL
Frameworks & Libraries: React, Node.js, Express, FastAPI, Next.js, Redux
Databases & Storage: PostgreSQL, Redis, DynamoDB, MongoDB
Cloud & DevOps: AWS (EC2, S3, Lambda, ECS), Docker, CI/CD (GitHub Actions), Terraform
Testing & Tools: Jest, PyTest, Git, Datadog

PROFESSIONAL EXPERIENCE

Veloce Cloud Solutions | Senior Software Engineer
May 2022 – Present | San Francisco, CA
- Led backend engineering team of 5 engineers delivering high-throughput telemetry API processing 14,000 requests per second.
- Re-architected data ingestion pipeline using Node.js and AWS Lambda, reducing p99 latency by 38% and cloud infrastructure spend by $42,000 annually.
- Integrated PostgreSQL read replicas and Redis caching layer to eliminate database bottlenecks during peak customer reporting windows.
- Spearheaded team-wide automated test coverage initiative, raising branch coverage from 64% to 91% across 18 microservices.

Apex Analytics | Full-Stack Software Engineer
June 2019 – April 2022 | Austin, TX
- Built customer-facing analytics dashboards using React, TypeScript, and Tailwind CSS used by 120,000 monthly active users.
- Designed REST and GraphQL APIs using Python FastAPI and PostgreSQL to support enterprise client reporting needs.
- Automated deployment workflows using Docker and GitHub Actions, cutting release cycles from 3 days to under 40 minutes.
- Collaborated with product designers and security teams to implement enterprise Single Sign-On (SAML/OAuth 2.0).

EDUCATION
Bachelor of Science in Computer Science, University of Texas at Austin, 2019`,
    jobDescription: `Job Title: Staff Platform Engineer - AI & Cloud Infrastructure
Company: NovaScale Technologies
Location: San Francisco, CA (Hybrid)

About the Role:
NovaScale is building next-generation infrastructure for enterprise generative AI workloads. We are seeking a Staff Platform Engineer to lead the design and implementation of our distributed model serving platform, container orchestration pipelines, and high-reliability cloud architecture.

Key Responsibilities:
- Architect and scale production Kubernetes clusters hosting LLM inference services and vector database workloads.
- Implement distributed tracing and observability using OpenTelemetry, Prometheus, and Grafana to maintain 99.99% service availability.
- Design resilient microservices in Go and Python with gRPC communication protocols.
- Lead architecture reviews, mentor senior engineers, and champion infrastructure-as-code using Terraform and Helm.
- Partner with machine learning researchers to deploy model orchestration pipelines utilizing Triton or Ray.

Required Qualifications:
- 6+ years of professional software engineering experience with deep platform/infrastructure focus.
- Production expertise in container orchestration using Kubernetes, Helm charts, and cloud-native networking.
- Strong proficiency in Go or Python and building distributed gRPC/REST APIs.
- Hands-on experience with vector search systems (e.g., Pinecone, Milvus, pgvector) or distributed streaming (Kafka).
- Deep experience in distributed systems reliability, zero-downtime blue/green deployments, and OpenTelemetry instrumentation.`,
  },
  {
    id: 'lead-frontend-architect',
    label: 'Senior Frontend → Lead Web & Design Systems Architect',
    role: 'Lead Frontend Architect',
    candidateName: 'Elena Rostova',
    candidateContact: 'elena.rostova.ux@gmail.com · (646) 312-9876 · New York, NY · github.com/erostova · elenarostova.dev',
    resumeText: `Elena Rostova
Senior Frontend Engineer
New York, NY | elena.rostova.ux@gmail.com | (646) 312-9876

PROFESSIONAL SUMMARY
Frontend specialist with 7 years of experience building accessible, high-performance web applications and modular design systems. Expert in TypeScript, React, Next.js, and CSS architecture. Passionate about Core Web Vitals, developer tooling, and pixel-perfect design craft.

SKILLS
Frontend: React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Sass
State & Data: TanStack Query, Redux Toolkit, Zustand, GraphQL, REST APIs
Build & Tools: Vite, Webpack, Turborepo, Jest, React Testing Library, Storybook, Figma, Git
Core Disciplines: Web Accessibility (WCAG 2.1 AA), Core Web Vitals (LCP, INP, CLS), Component Driven Development

EXPERIENCE

Kinetic Interactive | Lead UI Engineer
Jan 2022 – Present | New York, NY
- Directed frontend architecture for enterprise SaaS application suite serving 350k enterprise seats across 14 countries.
- Built accessible design component library in Storybook with 60+ headless React primitives, adopted by 8 product squads.
- Reduced initial bundle load time by 44% through code-splitting, tree-shaking, and lazy-loading non-critical vendor modules.
- Mentored 6 mid-level engineers through code reviews, architectural RFCs, and weekly frontend guilds.

Starlight Media | Senior Frontend Developer
Feb 2018 – Dec 2021 | Boston, MA
- Developed high-traffic consumer media web application using React, Next.js, and styled-components with 2M monthly page views.
- Implemented responsive, mobile-first layouts with 100% WCAG AA contrast compliance and keyboard navigation.
- Partnered with UX researchers to conduct A/B testing on checkout funnel, lifting conversion by 17.4%.

EDUCATION
B.S. in Software Engineering, Northeastern University, 2018`,
    jobDescription: `Job Title: Lead Frontend Architect - Core Platform & Design Systems
Company: Prism Systems
Location: New York, NY (Hybrid)

Prism Systems is seeking a visionary Lead Frontend Architect to govern our global web technology standards, design systems, and rendering performance.

What You Will Do:
- Architect enterprise micro-frontends and monorepo tooling using Turborepo and Vite.
- Lead the evolution of our unified design system, ensuring strict WCAG 2.2 AAA accessibility, zero-runtime CSS, and fluid spatial tokens.
- Drive Interaction to Next Paint (INP) and Largest Contentful Paint (LCP) optimizations across high-density interactive dashboards.
- Introduce client-side state synchronization with WebSockets and real-time collaboration canvas components.
- Establish automated visual regression testing pipelines using Playwright and chromatic Storybook runners.

Qualifications:
- 7+ years delivering complex, production-scale web applications with modern React and TypeScript.
- Demonstrated authority in frontend performance profiling (Chrome DevTools, web vitals, memory leak detection).
- Proven experience building component design systems distributed across npm or internal registries.
- Solid understanding of WebGL / Three.js canvas rendering or real-time web worker architecture is a strong plus.`,
  },
  {
    id: 'backend-distributed-systems',
    label: 'Backend Engineer → Distributed Systems & Reliability Lead',
    role: 'Principal Distributed Systems Engineer',
    candidateName: 'Marcus Vance',
    candidateContact: 'm.vance@vancetech.io · (206) 555-0149 · Seattle, WA · github.com/mvance-dev',
    resumeText: `Marcus Vance
Staff Backend Engineer
Seattle, WA | m.vance@vancetech.io | (206) 555-0149

SUMMARY
Backend engineer with 8 years of experience building mission-critical data systems, transactional databases, and event-driven architectures. Deep expertise in Golang, Java, Apache Kafka, and distributed consensus.

TECHNICAL PROFICIENCIES
Languages: Go, Java, C++, SQL, Bash
Distributed Systems: Apache Kafka, RabbitMQ, gRPC, Protocol Buffers, Raft, Paxos
Databases: PostgreSQL, Cassandra, CockroachDB, RocksDB, Redis
Infrastructure: Linux internals, Docker, Kubernetes, AWS, Prometheus

EXPERIENCE

HyperScale Core | Senior Distributed Systems Engineer
March 2021 – Present | Seattle, WA
- Engineered distributed event streaming pipeline using Go and Apache Kafka processing 850M daily events with zero data loss.
- Implemented custom partitioner and compaction routines that reduced disk consumption across Kafka clusters by 32%.
- Designed resilient gRPC microservices with circuit breakers, adaptive retry policies, and distributed rate limiters.
- Diagnosed complex multi-region replication lag issues in distributed database clusters, ensuring sub-50ms consistency.

Aegis Security Networks | Backend Software Engineer
August 2017 – Feb 2021 | Portland, OR
- Developed real-time threat intelligence backend in Java and Go querying petabyte-scale Cassandra tables.
- Built low-latency in-memory cache utilizing RocksDB, reducing database query load by 60%.
- Authored automated integration test suites for network protocol decoders with 94% code coverage.

EDUCATION
B.S. in Computer Engineering, University of Washington, 2017`,
    jobDescription: `Job Title: Principal Distributed Systems Engineer - High Throughput & Consensus
Company: Axiom Global Ledger
Location: Seattle, WA

Role Overview:
Axiom is creating real-time cryptographic consensus and settlement networks for global financial institutions. We need a Principal Distributed Systems Engineer to design fault-tolerant replication engines and lock-free concurrency protocols.

Key Responsibilities:
- Author core consensus engines utilizing Raft or Paxos protocols in Go or Rust.
- Optimize Linux network socket performance and memory allocation using eBPF, io_uring, and zero-copy ring buffers.
- Architect active-active multi-region failover mechanisms guaranteeing strong ACID consistency.
- Define engineering standards for chaos engineering, fault injection testing, and disaster recovery.

Requirements:
- 8+ years experience designing ultra-low-latency distributed backend systems.
- Mastery of concurrency models, synchronization primitives, memory barriers, and lock-free data structures.
- Hands-on expertise with Apache Kafka, Raft state machines, and distributed storage engines.
- Strong knowledge of Linux kernel internals, TCP/IP networking stack, and eBPF tracing tools.`,
  },
];
