// Data — content for portfolio, blog, team
import begumPhoto from '../assets/portraits/begum_photo.jpg'
import luPhoto from '../assets/portraits/lu_photo.jpeg'
import vertiPhoto from '../assets/portraits/vertti_photo.jpg'

export const NAV = [
  { id: 'home',      label: 'Home',                  },
 // { id: 'archival',  label: 'Archival AI',          external: 'https://archivalai.onto.fi' },
  { id: 'bel',       label: 'Beyond Easy Language',  },
  { id: 'portfolio', label: 'Portfolio',             },
//  { id: 'blog',      label: 'Blog',                 },
  { id: 'manifesto', label: 'Manifesto',             },
  { id: 'about',     label: 'About Us',              },
  { id: 'contact',   label: 'Contact',              },
];

export const WORDS = ['Media', 'Archive', 'AI', 'Data', 'Design', 'Experience'];

export const SERVICES = [
  {
    title: 'Custom AI & Data Solutions',
    desc: '',
    accent: false,
    size: 'large',
  },
  {
    title: 'Consultancy',
    desc: '',
    accent: false,
    size: 'narrow',
    icon: true,
  },
  {
    title: 'Research & Curatorial Projects',
    desc: 'Concept development, exhibition production, digital interfaces and interactive installations.',
    accent: false,
    size: 'large',
  },
  {
    title: 'Collaboration',
    desc: 'Partner with us to strategize and build future-proof archive ecosystems that balance automation and human insight.',
    accent: false,
    size: 'large',
  },
];

export const PORTFOLIO = [
  {
    title: 'Nokia Design Archive',
    partner: 'Nokia Design Archive & Aalto University',
    year: '2025',
    contributors: ['Lù Chén'],
    desc: `A publicly accessible digital portal developed at Aalto University's Department of Design, built from materials donated by Microsoft Mobile Oy and Nokia designers. The source archive comprises 20,000+ entries and ~950GB of files spanning the mid-1990s to 2017. Lù Chén prototyped interactive visualisations in 2023 and continued web development in 2024; the portal launched in January 2025. Remediates archival material into accessible knowledge through interactive visualisations.`,
    tags: ['Archive', 'Visualisation', 'Research'],
    img: 'nokia_design_archive.png',
    links: [
      { label: 'Website', url: 'https://nokiadesignarchive.aalto.fi/' },
      { label: 'Research', url: 'https://aaltodoc.aalto.fi/items/ea5943dc-f19c-4811-9fb5-790dbd3e51da' },
    ],
  },
  {
    title: 'Teoman Madra Archive',
    partner: 'Sabancı University & Madra Family',
    year: '2021-2025',
    contributors: ['Begüm Çelik'],
    desc: 'An ongoing conservation and digitisation effort to rescue and organise the multimedia oeuvre of Teoman Madra, a pioneer of Turkish media art (1960s–2000s). Begüm Çelik & Selçuk Artut retrieved scattered materials, stabilised fragile carriers, and began systematic digitisation and cataloguing of slides, negatives, VHS/Betamax/miniDV tapes, optical media, and drives. Descriptions follow museum-grade standards (CDWA/CCO).',
    tags: ['Archive', 'Conservation', 'Cataloguing'],
    img: 'Light-Games-circa-the-1960s-CTeoman-Madra-Collection.png',
    links: [
      { label: 'Research', url: 'https://research.sabanciuniv.edu/id/eprint/50987/' },
    ],
  },
  {
    title: 'Tuumailubotti',
    partner: 'A Large Finnish Media Company',
    year: '2024',
    contributors: ['Begüm Çelik', 'Vertti Luostarinen'],
    desc: 'An experimental conversational AI exploring how a chatbot might represent neurodiverse rhetoric rather than defaulting to neuronormative styles. Built on Finnish FinGPT-3 models for native-level Finnish proficiency; evaluated with 31 participants. The curated dataset was released openly. Tuumailubotti blends HR support, design research and local-language AI to ask how conversational systems can better include neurodivergent ways of communicating.',
    tags: ['AI', 'Research', 'Language'],
    img: 'tuumalibotti.png',
    links: [
      { label: 'Research', url: 'https://aaltodoc.aalto.fi/items/78ee8740-eed2-4be9-8171-42ecb603ecad' },
    ],
  },
];

export const BLOG = [
  {
    title: 'Resurrecting the Website of An Abandoned Hotel',
    date: 'Apr 2, 2026',
    excerpt: `Väärätalo, which in English could be translated as "The Crooked House", or more literally, as "The Wrong House" is a central landmark in the city center of Imatra, a small Finnish town near the Russian border. The building has earned its reputation through years of neglect.`,
    tags: ['interactive-art','lost-media','abandoned-places','media-archaeology','llm'],
    img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&q=70',
  },
  {
    title: 'Grant awarded for AI-generated news simplification project',
    date: 'Dec 14, 2025',
    excerpt: `The project 'Beyond Plain Language: Participatory AI-Generated News Simplification for S2 Learners' received a grant from the Media Industry Research Foundation of Finland.`,
    tags: ['media','ai','research'],
    img: 'https://images.unsplash.com/photo-1633335060261-cb8c0a384b8a?w=900&q=70',
  },
  {
    title: 'Swedish Text-to-speech model released',
    date: 'Nov 2, 2025',
    excerpt: `An open source Swedish TTS model trained for Ekho Collective's installation Layers in the Peace Machine.`,
    tags: ['ai'],
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=70',
  },
  {
    title: 'On rescuing 950GB of design history',
    date: 'Oct 18, 2025',
    excerpt: 'Field notes from the Nokia Design Archive: cataloguing donated material across two decades of mobile design.',
    tags: ['archive','media-archaeology','research'],
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=70',
  },
  {
    title: 'Letting chatbots speak neurodivergently',
    date: 'Sep 6, 2025',
    excerpt: 'On Tuumailubotti — an experimental chatbot that represents neurodiverse rhetoric rather than defaulting to a neuronormative voice.',
    tags: ['chatbots','ai','llm','research'],
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=70',
  },
  {
    title: 'CDWA, CCO, Dublin Core — picking a schema',
    date: 'Aug 12, 2025',
    excerpt: `Choosing a metadata schema for a heritage archive isn't just a technical question — it shapes how a collection can be read for decades.`,
    tags: ['archive','research'],
    img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=900&q=70',
  },
];

export const BLOG_TAGS = ['all','ai','llm','art','media','chatbots','interactive-art','archive','research'];

export const TEAM = [
  {
    name: 'Begüm Çelik',
    role: 'Designer & Web Developer, Archive Researcher',
    bio: 'Media artist, creative technologist, and archive researcher. Holds an M.A. in Visual Arts & Visual Communication Design from Sabancı University, alongside a B.Sc. in Computer Science & Engineering with a minor in Art Theory & Criticism. Co-founder of metr.cube, an independent art initiative based in Istanbul, and a creative technologist at Ekho Collective.',
    link: 'https://www.linkedin.com/in/begum-celik/',
    web: 'https://www.begumcelik.org',
    mail: 'mailto:begum@onto.fi',
    img: begumPhoto,
  },
  {
    name: 'Lù Chén',
    role: 'UX Designer & Participatory Design Researcher',
    bio: 'Helsinki-based design researcher and media artist combining data visualisation, physical computing, and co-design with inquiries into migration, sustainability politics, and feminist techno-science studies.',
    link: 'https://www.linkedin.com/in/lù-chén-43177191/',
    web: 'https://l-lu-u.github.io/',
    mail: 'mailto:lu@onto.fi',
    img: luPhoto,
  },
  {
    name: 'Vertti Luostarinen',
    role: 'AI Researcher & Developer',
    bio: 'Finnish media artist, developer and AI researcher. Holds an MA in New Media from Aalto University. Multidisciplinary practice at the intersection of artistic research, media, and technology. Works as an AI researcher with Alma Media and Yle News Lab; part of Ekho Collective.',
    link: 'https://www.linkedin.com/in/vertti-luostarinen-b31012155/',
    web: 'https://vertti.eu/',
    mail: 'mailto:vertti@onto.fi',
    img: vertiPhoto,
  },
];

export const MANIFESTO = [
  'We believe an archive is not a graveyard. It is a future memory — a substrate for new work, new questions, and new readers we will never meet.',
  'We build AI systems that are transparent, explainable, and grounded in respect for data ownership. Working with archives often means handling sensitive and irreplaceable material, so security and privacy are first priorities, not afterthoughts.',
  `We don't use or train on client data without consent, and we reject black-box AI practices. Every project runs on traceable, permission-based pipelines, ensuring institutions retain full control of their datasets.`,
  'We balance automation with human oversight. Software drafts; people decide. Curators, archivists, and domain experts stay in the loop — always.',
];

export const PRINCIPLES = [
  { num: '01', h: 'Consent before capacity', b: 'Capability is not permission. We ask first, ship second.' },
  { num: '02', h: 'Human in the loop',        b: 'Drafts from machines, decisions from people. Audit trails by default.' },
  { num: '03', h: 'Schemas serve people',     b: 'CDWA, CCO, Dublin Core — or your custom one. Whatever your community already speaks.' },
  { num: '04', h: 'Boring infrastructure',    b: 'Versioned, traceable, exportable. The archive should outlive the tool.' },
  { num: '05', h: 'Plural voices',            b: 'Neurodivergent, non-English, marginal. The default voice is not the only voice.' },
  { num: '06', h: 'Slow when it matters',     b: 'A 60-year-old tape gets one chance. We never optimise it away.' },
];
