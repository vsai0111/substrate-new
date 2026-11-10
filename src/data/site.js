/**
 * Single source of truth for site content.
 * Everything here is fictional — Substrate is an invented studio.
 */

export const brand = {
  name: 'SUBSTRATE',
  descriptor: 'Technology & Product Studio',
  email: 'hello@substrate.studio',
  founded: '2019',
  locations: ['Bengaluru', 'Lisbon'],
}

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Experiments', href: '#experiments' },
  { label: 'Contact', href: '#contact' },
]

export const hero = {
  lines: ['We build the', 'systems that', 'come next.'],
  statement:
    'Substrate is an independent studio working across design, engineering, applied AI, and digital products. We partner with small teams on things that do not exist yet — interfaces for new models, infrastructure that has to hold, and the design systems that keep both coherent.',
  meta: [
    { k: 'Est.', v: '2019' },
    { k: 'Index', v: '024 / 09' },
    { k: 'Status', v: 'Open — Q3' },
  ],
}

export const projects = [
  {
    id: '01',
    name: 'HALIDE',
    tagline: 'Reasoning interface for a multi-agent research platform',
    description:
      'A workspace where long-running agents are legible: every step traceable, every branch comparable, every intervention reversible. Shipped as a design system and a React application.',
    category: 'AI Interface',
    year: '2025',
    duration: '14 weeks',
    scope: ['Product Design', 'Frontend', 'Design System'],
    visual: 'orbit',
  },
  {
    id: '02',
    name: 'PLINTH',
    tagline: 'Component infrastructure for a regulated fintech platform',
    description:
      'One hundred and forty components, four product surfaces, a single token pipeline. Built to survive audits, redesigns, and the six teams consuming it.',
    category: 'Design Systems',
    year: '2024',
    duration: '9 months',
    scope: ['Design System', 'Tooling', 'Documentation'],
    visual: 'grid',
  },
  {
    id: '03',
    name: 'BATSY',
    tagline: 'Automation infrastructure for high-volume editorial operations',
    description:
      'Ingest, classify, route, publish. We replaced eleven manual handoffs with an event pipeline and a control surface an editor can actually read.',
    category: 'Automation',
    year: '2024',
    duration: '11 weeks',
    scope: ['Systems Design', 'Cloud Infrastructure', 'Frontend'],
    visual: 'flow',
  },
  {
    id: '04',
    name: 'SOLSTICE',
    tagline: 'Experimental spatial tool for model evaluation',
    description:
      'An internal instrument for comparing model outputs across thousands of prompts at once — density, drift, and disagreement rendered as terrain.',
    category: 'Prototype / R&D',
    year: '2023',
    duration: '5 weeks',
    scope: ['Prototyping', 'Data Visualisation', 'Research'],
    visual: 'terrain',
  },
  {
    id: '05',
    name: 'FERRO',
    tagline: 'Realtime telemetry console for distributed fleets',
    description:
      'Twelve thousand devices, one screen, sub-second updates. Designed around the two questions an operator asks at 3am: what broke, and what does it touch.',
    category: 'Product Platform',
    year: '2023',
    duration: '6 months',
    scope: ['Product Design', 'Frontend', 'Performance'],
    visual: 'pulse',
  },
]

export const experiments = [
  {
    word: 'AI',
    index: 'X-01',
    note: 'Interfaces for systems that reason. Legibility over magic — if a model made a decision, the surface should be able to show its work.',
  },
  {
    word: 'SYSTEMS',
    index: 'X-02',
    note: 'Tokens, primitives, and the rules that hold them together. We design the constraints first and let the screens follow.',
  },
  {
    word: 'CODE',
    index: 'X-03',
    note: 'Production frontend as a design material. Typed, tested, measured — a prototype that survives contact with real data.',
  },
  {
    word: 'DESIGN',
    index: 'X-04',
    note: 'Editorial thinking applied to software. Hierarchy, rhythm, restraint, and the confidence to leave space empty.',
  },
  {
    word: 'AUTOMATION',
    index: 'X-05',
    note: 'Pipelines that remove the handoff. The interesting problem is rarely the script — it is the surface that makes the script trustworthy.',
  },
  {
    word: 'PROTOTYPES',
    index: 'X-06',
    note: 'Small, fast, disposable. We build to learn, kill most of it, and carry the two ideas that earned their keep.',
  },
]

export const about = {
  lines: ['A small studio', 'working between', 'design, engineering', 'and applied AI.'],
  body: [
    'We are eight people. That is deliberate. Every engagement is run by the people who do the work, which means fewer translations between the thing that was decided and the thing that ships.',
    'We take on a handful of partnerships a year — usually with founding teams, research groups, or product organisations rebuilding something load-bearing. We stay long enough to hand over something maintainable.',
  ],
  pillars: ['Design', 'Engineering', 'AI', 'Systems', 'Experimentation'],
  stats: [
    { v: '08', k: 'People' },
    { v: '40+', k: 'Engagements' },
    { v: '06', k: 'Years' },
    { v: '02', k: 'Studios' },
  ],
}

export const capabilities = [
  {
    id: '01',
    name: 'Product Design',
    note: 'Research, interaction, interface. From the first sketch to the shipped surface.',
  },
  {
    id: '02',
    name: 'Frontend Engineering',
    note: 'React, accessible by default, measured against real device budgets.',
  },
  {
    id: '03',
    name: 'AI Interfaces',
    note: 'Patterns for streaming, uncertainty, agency, and correction.',
  },
  {
    id: '04',
    name: 'Design Systems',
    note: 'Tokens, primitives, documentation, and the governance that keeps them alive.',
  },
  {
    id: '05',
    name: 'Automation',
    note: 'Event pipelines and internal tooling that remove the manual handoff.',
  },
  {
    id: '06',
    name: 'Cloud Infrastructure',
    note: 'Static delivery, edge caching, CI/CD, and pragmatic observability.',
  },
  {
    id: '07',
    name: 'Prototyping',
    note: 'Working artefacts in days, built to answer one question at a time.',
  },
]

export const process = [
  {
    id: '01',
    name: 'Discover',
    note: 'We read the code, talk to the people using it, and find where the friction actually lives.',
  },
  {
    id: '02',
    name: 'Define',
    note: 'One page. The problem, the constraints, the thing we are optimising for, and what we are willing to lose.',
  },
  {
    id: '03',
    name: 'Design',
    note: 'Structure before surface. Flows, states, and edge cases before anything gets a colour.',
  },
  {
    id: '04',
    name: 'Build',
    note: 'Production code from week one. No throwaway mockups pretending to be progress.',
  },
  {
    id: '05',
    name: 'Deploy',
    note: 'Automated pipelines, static delivery, reversible releases. Shipping should be boring.',
  },
  {
    id: '06',
    name: 'Iterate',
    note: 'Instrument, observe, cut what nobody uses. The second version is where the work pays off.',
  },
]

export const socials = [
  { label: 'GitHub', href: '#top' },
  { label: 'Dribbble', href: '#top' },
  { label: 'LinkedIn', href: '#top' },
  { label: 'RSS', href: '#top' },
]
