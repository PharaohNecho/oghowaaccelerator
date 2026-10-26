import { Mentor, NewsArticle, Venture, ApplicationSubmission, PartnerItem, CarouselSlide, BusinessWeekConfig, SmtpSettings } from '../types';

export const DEFAULT_SMTP_SETTINGS: SmtpSettings = {
  senderEmail: 'oghowa@metaspaceconsult.com',
  incomingServer: 'mail.metaspaceconsult.com',
  imapPort: 993,
  pop3Port: 995,
  outgoingServer: 'mail.metaspaceconsult.com',
  smtpPort: 465,
  useSsl: true,
  status: 'Connected',
  lastTestedAt: 'Verified SSL/TLS'
};

export const WHO_WE_SERVE_DATA = [
  {
    id: 'founders',
    title: 'Founders',
    description: 'Transform bold ideas into scalable businesses.',
    actionLabel: 'Become a Founder',
    iconName: 'Rocket',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-100',
    targetTrack: 'incubation'
  },
  {
    id: 'investors',
    title: 'Investors',
    description: 'Access vetted deal flow and co-investment opportunities.',
    actionLabel: 'Join as Investor',
    iconName: 'TrendingUp',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    targetTrack: 'capital'
  },
  {
    id: 'corporates',
    title: 'Corporates',
    description: 'Partner with startups to innovate and address head challenges.',
    actionLabel: 'Partner With Us',
    iconName: 'Building2',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
    targetTrack: 'partner'
  },
  {
    id: 'government',
    title: 'Government',
    description: 'Drive innovation and economic development.',
    actionLabel: 'Collaborate',
    iconName: 'Landmark',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    targetTrack: 'partner'
  },
  {
    id: 'universities',
    title: 'Universities',
    description: 'Commercialize research and develop student entrepreneurs.',
    actionLabel: 'Join Institutions',
    iconName: 'GraduationCap',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    targetTrack: 'incubation'
  },
  {
    id: 'ecosystem',
    title: 'Ecosystem Partners',
    description: "Collaborate to strengthen Africa's innovation ecosystem.",
    actionLabel: 'Partner With Us',
    iconName: 'Users2',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-100',
    targetTrack: 'partner'
  }
];

export const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Discover',
    summary: 'Find opportunities, validate ideas and meet co-founders.',
    details: 'Through hackathons, design sprints, and ideation mixers, aspiring founders connect with co-founders and identify acute market pain points across African commerce, healthcare, and education.',
    icon: 'Compass',
    highlight: false
  },
  {
    number: '02',
    title: 'Build',
    summary: 'Access mentorship, venture studio and agile infrastructure.',
    details: 'Embedded engineering pods, product managers, and legal support help founders build their initial prototypes and compliant technical architecture from day one.',
    icon: 'Wrench',
    highlight: false
  },
  {
    number: '03',
    title: 'Validate',
    summary: 'Test your product, achieve product-market fit and gain traction.',
    details: 'Rapid feedback loops with corporate pilots, early adopters in Edo State and West Africa, and rigorous data analytics to verify authentic willingness to pay.',
    icon: 'BarChart2',
    highlight: false
  },
  {
    number: '04',
    title: 'Fund',
    summary: 'Connect with grants, angels and strategic capital partners.',
    details: 'Access non-dilutive catalytic grant pools, our ₦500M+ venture syndicate, and direct introductions to leading Pan-African and global institutional investors.',
    icon: 'Coins',
    highlight: true // red highlight in the image!
  },
  {
    number: '05',
    title: 'Scale',
    summary: 'Access markets, expansion support and global operations.',
    details: 'Structured playbooks for multi-city expansion across Nigeria, Ghana, Kenya, and beyond, with regulatory clearance and operational resilience.',
    icon: 'Globe2',
    highlight: false
  },
  {
    number: '06',
    title: 'Exit & Reinvest',
    summary: 'Create lasting impact and reinvest in the next generation.',
    details: 'Support with strategic M&A, secondary sales, and alumni angel syndication to mentor and back the next wave of frontier founders.',
    icon: 'Award',
    highlight: false
  }
];

export const FLAGSHIP_PLATFORMS = [
  {
    id: 'innovation-weekend',
    title: 'Óghowa Innovation Weekend',
    description: '48-hour hackathon & ideation sprint to prototype solutions for acute regional and global challenges.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=70',
    cohortSchedule: 'Quarterly · Next: Nov 2026',
    features: ['Rapid prototype labs', '₦5M in prize grants', 'Direct entry to incubation']
  },
  {
    id: 'venture-studio',
    title: 'Óghowa Business Week',
    description: "Africa's flagship annual gathering for innovation, entrepreneurship, governance, capital mobilization, and investment dialogue in collaboration with Benin Tech Fest.",
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=70',
    cohortSchedule: 'Annual Summit · Nov 16–21, 2026',
    features: ['Thematic policy roundtables', '₦50M Deal Syndicate', 'Institutional partnerships']
  },
  {
    id: 'incubation',
    title: 'Incubation',
    description: 'Hands-on mentorship, coworking space, technical credits and direct corporate market access.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=70',
    cohortSchedule: 'Cohort 2026-B Open',
    features: ['1-on-1 weekly mentor sessions', 'Edo Innovates tech hub access', '$100k AWS/GCP credits']
  },
  {
    id: 'capital-network',
    title: 'Capital Network',
    description: 'Connecting founders with angels, syndicate venture capital and catalytic grant financing.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=70',
    cohortSchedule: 'Active Syndicate',
    features: ['Demo Day investor showcase', '₦500M+ committed fund', 'Due diligence support']
  },
  {
    id: 'business-week',
    title: 'Óghowa Business Week',
    description: "Edo State's flagship sub-national summit connecting ideas with investment, innovation with enterprise, and partnerships with measurable economic impact.",
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=500&q=70',
    cohortSchedule: 'Annual Summit · Nov 16–21, 2026',
    features: ['Keynote addresses', 'Ecosystem matchmaking', 'Government-founder roundtables']
  },
  {
    id: 'research-policy-lab',
    title: 'Research & Policy Lab',
    description: 'Supporting innovation through evidence-based policy, industry reports and ecosystem intelligence.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=70',
    cohortSchedule: 'Quarterly Publications',
    features: ['State tech index', 'Regulatory sandboxes', 'Academic commercialization']
  }
];

export const INFRASTRUCTURE_ITEMS = [
  { name: 'Cloud Infrastructure', icon: 'Cloud' },
  { name: 'AI Platforms', icon: 'Cpu' },
  { name: 'Payments', icon: 'CreditCard' },
  { name: 'Legal & Compliance', icon: 'ShieldCheck' },
  { name: 'Business Intelligence', icon: 'LineChart' },
  { name: 'Logistics', icon: 'Truck' },
  { name: 'Talent Network', icon: 'Users' },
  { name: 'Marketing', icon: 'Megaphone' },
  { name: 'Software Tools', icon: 'Code2' },
  { name: 'Cybersecurity', icon: 'Lock' },
  { name: 'Enterprise Partners', icon: 'Building' },
  { name: 'Global Networks', icon: 'Network' }
];

export const IMPACT_METRICS = [
  { value: '100+', label: 'Ventures Supported', icon: 'Rocket', color: 'text-rose-500' },
  { value: '₦500M+', label: 'Capital Facilitated', icon: 'Coins', color: 'text-emerald-500' },
  { value: '5,000+', label: 'Community Members', icon: 'Users', color: 'text-blue-500' },
  { value: '50+', label: 'Strategic Partners', icon: 'Handshake', color: 'text-indigo-500' },
  { value: '12', label: 'Innovation Sectors', icon: 'Layers', color: 'text-amber-500' },
  { value: '20+', label: 'Programs & Initiatives', icon: 'CalendarDays', color: 'text-rose-500' }
];

export const FEATURED_VENTURES: Venture[] = [
  {
    id: 'ugbekun-smp',
    name: 'Ugbekun SMP',
    sector: 'Education Technology',
    tagline: 'Modern school management & digital administrative ecosystem.',
    description: 'Comprehensive school management platform simplifying school administration, tuition reconciliation, attendance, and student academic performance across K-12 institutions.',
    founder: 'Osasere Idehen',
    metrics: [
      { label: 'Schools', value: '180+' },
      { label: 'Active Students', value: '52,000+' },
      { label: 'Admin Efficiency', value: '+74%' }
    ],
    cohort: 'Cohort 2025-A',
    stage: 'Scaling',
    logoText: 'US',
    badgeColor: 'bg-blue-600',
    highlights: ['Edo State EdTech Pilot Partner', 'Integrated tuition payment gateway', 'Ministry of Education accredited'],
    isDisplayed: true
  },
  {
    id: 'myeduride',
    name: 'MyEduRide',
    sector: 'Transport Technology',
    tagline: 'Smart student and campus mobility for safety and reliability.',
    description: 'Tech-enabled student transportation management and route optimization ensuring guaranteed child transit security, real-time bus telemetry, and parent peace of mind.',
    founder: 'Efe Omoregie',
    metrics: [
      { label: 'Safe Trips', value: '220,000+' },
      { label: 'Partner Schools', value: '45' },
      { label: 'On-Time Rate', value: '99.1%' }
    ],
    cohort: 'Cohort 2025-B',
    stage: 'Accelerated',
    logoText: 'MR',
    badgeColor: 'bg-amber-500',
    highlights: ['Geo-fenced tracking alerts', 'Fleet telematics integration', 'Corporate logistics partnership'],
    isDisplayed: true
  },
  {
    id: 'cyona-medicare',
    name: 'Cyona Medicare',
    sector: 'Health Technology',
    tagline: 'Digital diagnostics and patient-provider matching platform.',
    description: 'Clinic and patient healthcare services matching platform providing verified telehealth consultations, digitized medical records, and doorstep prescription delivery.',
    founder: 'Dr. Blessing Osagie',
    metrics: [
      { label: 'Consultations', value: '35,000+' },
      { label: 'Partner Clinics', value: '78' },
      { label: 'Patient Rating', value: '4.9/5' }
    ],
    cohort: 'Cohort 2025-B',
    stage: 'Scaling',
    logoText: 'CM',
    badgeColor: 'bg-emerald-600',
    highlights: ['Certified NHIS tele-health partner', 'Affordable rural outreach', '₦45M Seed extension closed'],
    isDisplayed: true
  }
];

export const MENTORS_LIST: Mentor[] = [
  {
    id: 'm1',
    name: 'Ighodalo Osagie',
    role: 'Venture Partner & Ex-Fintech Lead',
    organization: 'Ventures Platform / ex-Paystack',
    previousRoles: 'Senior Engineering Manager at Flutterwave',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&crop=faces&q=70',
    bio: '12+ years building financial infrastructure and payment APIs across Sub-Saharan Africa. Specialized in regulatory navigation, core banking integrations, and pre-seed to Series A fundraising.',
    domain: 'FinTech',
    expertise: ['API Architecture', 'Central Bank Licensing', 'Investor Pitching', 'Unit Economics'],
    location: 'Benin City & Lagos, Nigeria',
    sessionsCount: 74,
    rating: 4.9,
    availableDays: ['Tuesdays', 'Thursdays'],
    slots: ['10:00 AM WAT', '02:00 PM WAT', '04:30 PM WAT'],
    linkedinUrl: 'https://linkedin.com/in/ighodalo-osagie',
    featured: true
  },
  {
    id: 'm2',
    name: 'Dr. Aisosa Edebiri',
    role: 'Chief Medical Officer & HealthTech Founder',
    organization: 'Helios Health / Edo Innovates Health Fellow',
    previousRoles: 'Consultant Epidemiologist, WHO West Africa',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=120&h=120&crop=faces&q=70',
    bio: 'Physician entrepreneur scaling telemedicine and medical diagnostic logistics. Advises startups on health regulation compliance, institutional procurement, and ethical health data.',
    domain: 'HealthTech',
    expertise: ['Health Regulations', 'Clinical Pilots', 'B2B Hospital Sales', 'Telehealth Systems'],
    location: 'Benin City, Edo State',
    sessionsCount: 52,
    rating: 5.0,
    availableDays: ['Mondays', 'Wednesdays'],
    slots: ['11:00 AM WAT', '03:00 PM WAT'],
    linkedinUrl: 'https://linkedin.com/in/aisosa-edebiri',
    featured: true
  },
  {
    id: 'm3',
    name: 'Korede Babatunde',
    role: 'Head of Product & Growth',
    organization: 'African Tech Scaleup / AWS Community Hero',
    previousRoles: 'Product Lead at Kuda Bank',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&crop=faces&q=70',
    bio: 'Passionate about zero-to-one product design, user retention loops, and growth experimentation in African urban hubs. Helped scale fintech and consumer apps to 2M+ active users.',
    domain: 'Product & Engineering',
    expertise: ['Product Roadmapping', 'User Onboarding', 'Analytics & Funnels', 'Design Sprints'],
    location: 'Lagos & Remote',
    sessionsCount: 88,
    rating: 4.9,
    availableDays: ['Wednesdays', 'Fridays'],
    slots: ['01:00 PM WAT', '03:30 PM WAT', '05:00 PM WAT'],
    linkedinUrl: 'https://linkedin.com/in/korede-babatunde',
    featured: true
  },
  {
    id: 'm4',
    name: 'Barrister Nosa Imasuen',
    role: 'Managing Partner',
    organization: 'LexFrontier Tech Legal Advisory',
    previousRoles: 'Senior Legal Counsel, NITDA Innovation Taskforce',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&crop=faces&q=70',
    bio: 'Veteran startup attorney specialized in corporate restructuring, SAFEs, Nigeria Startup Act incentives, IP protection, and cross-border Delaware / UK flip structures.',
    domain: 'Legal & Compliance',
    expertise: ['SAFE & Convertible Notes', 'Startup Act Tax Relief', 'IP & Trademarking', 'Cap Table Management'],
    location: 'Abuja & Benin City',
    sessionsCount: 63,
    rating: 4.8,
    availableDays: ['Tuesdays', 'Fridays'],
    slots: ['11:30 AM WAT', '02:30 PM WAT'],
    linkedinUrl: 'https://linkedin.com/in/nosa-imasuen'
  },
  {
    id: 'm5',
    name: 'Chidinma Okafor',
    role: 'Managing Director & Angel Syndicate Lead',
    organization: 'Savannah Seed Fund',
    previousRoles: 'Investment Associate at TLcom Capital',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&crop=faces&q=70',
    bio: 'Invested in 24+ early-stage startups across West and East Africa. Provides frank feedback on pitch narrative, financial model stress-testing, and investor term sheet negotiations.',
    domain: 'Fundraising & VC',
    expertise: ['Pitch Deck Critique', 'Term Sheet Negotiation', 'Valuation Modeling', 'Syndicate Formation'],
    location: 'Accra & Lagos',
    sessionsCount: 95,
    rating: 5.0,
    availableDays: ['Mondays', 'Thursdays'],
    slots: ['09:00 AM WAT', '12:00 PM WAT', '04:00 PM WAT'],
    linkedinUrl: 'https://linkedin.com/in/chidinma-okafor',
    featured: true
  },
  {
    id: 'm6',
    name: 'Victor Ehigiator',
    role: 'Solutions Architect & Cloud Lead',
    organization: 'AWS Africa / Cloud Africa Guild',
    previousRoles: 'Lead DevOps at Andela',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&crop=faces&q=70',
    bio: 'Specialist in high-availability cloud architecture, microservices, containerization, and cost-efficient cloud spending for early-stage bootstrapping tech ventures.',
    domain: 'Product & Engineering',
    expertise: ['AWS/GCP Architecture', 'CI/CD Pipelines', 'Database Scaling', 'Cost Optimization'],
    location: 'Benin City, Edo State',
    sessionsCount: 46,
    rating: 4.9,
    availableDays: ['Wednesdays', 'Saturdays'],
    slots: ['10:00 AM WAT', '01:00 PM WAT'],
    linkedinUrl: 'https://linkedin.com/in/victor-ehigiator'
  },
  {
    id: 'm7',
    name: 'Fatima Al-Hassan',
    role: 'VP of Growth & Enterprise Partnerships',
    organization: 'Pan-African Commerce Network',
    previousRoles: 'Regional Director at Jumia Group',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&h=120&crop=faces&q=70',
    bio: 'Built customer acquisition channels and corporate sales motions that generated over ₦1.8B in pipeline value. Mentors founders on sales leadership and strategic distribution.',
    domain: 'Growth & Go-To-Market',
    expertise: ['B2B Enterprise Sales', 'Channel Partnerships', 'Performance Marketing', 'Sales Pipeline Automation'],
    location: 'Lagos & Kigali',
    sessionsCount: 39,
    rating: 4.8,
    availableDays: ['Tuesdays', 'Wednesdays'],
    slots: ['02:00 PM WAT', '04:00 PM WAT'],
    linkedinUrl: 'https://linkedin.com/in/fatima-alhassan'
  },
  {
    id: 'm8',
    name: 'Omoye Obasohan',
    role: 'Chief Operating Officer',
    organization: 'Verdant Agritech',
    previousRoles: 'Operations Manager at Olam Nigeria',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&crop=faces&q=70',
    bio: 'Operations and supply chain strategist helping startups optimize physical logistics, supplier contracts, last-mile delivery, and unit profitability in challenging environments.',
    domain: 'Operations',
    expertise: ['Supply Chain Optimization', 'Last-Mile Logistics', 'Vendor Management', 'Operational Efficiency'],
    location: 'Benin City, Nigeria',
    sessionsCount: 31,
    rating: 4.9,
    availableDays: ['Thursdays', 'Fridays'],
    slots: ['01:30 PM WAT', '03:30 PM WAT'],
    linkedinUrl: 'https://linkedin.com/in/omoye-obasohan'
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Óghowa Accelerator Launches ₦500M Catalytic Capital Fund to Back Edo & West African Tech Innovators',
    slug: 'oghowa-launches-500m-catalytic-capital-fund',
    category: 'Press Release',
    date: 'October 12, 2026',
    readTime: '4 min read',
    author: {
      name: 'Venture Desk',
      role: 'Óghowa Editorial Team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&crop=faces&q=70'
    },
    summary: 'The new fund will provide direct equity and catalytic non-dilutive ticket sizes ranging from ₦10M to ₦50M for early-stage startups in EdTech, HealthTech, Logistics, and Agritech.',
    content: [
      'Benin City, Nigeria — Óghowa Accelerator today announced the formal closing and deployment of its ₦500 Million Catalytic Capital Fund. Designed in partnership with institutional investors, high-net-worth diaspora syndicates, and development finance institutions, the fund aims to bridge the early-stage financing gap for founders operating outside conventional metropolitan centers.',
      '"For too long, capital in West Africa has concentrated almost exclusively in a couple of coastal capital cities," remarked the Executive Director. "Yet some of the most resilient, innovative, and market-ready enterprise solutions are emerging right here in Edo State and the South-South corridor. Óghowa exists to discover, de-risk, and scale these extraordinary teams."',
      'Selected startups in the flagship Incubation and Venture Studio tracks will receive upfront capital, workspace at Edo Innovates tech hubs, up to $100,000 in cloud credits, and direct hands-on venture development from seasoned tech operators.',
      'Applications for the first cohort under the new fund are officially open and will close at the end of the quarter.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=70',
    tags: ['Venture Capital', 'Fund Launch', 'Edo State', 'Startup Funding'],
    featured: true
  },
  {
    id: 'news-2',
    title: 'Startup Spotlight: How Ogbelekon Is Modernizing K-12 School Administration for 140+ Schools',
    slug: 'startup-spotlight-ogbelekon-school-management',
    category: 'Venture Spotlight',
    date: 'October 04, 2026',
    readTime: '5 min read',
    author: {
      name: 'Osato Iyamu',
      role: 'Ecosystem Storyteller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&crop=faces&q=70'
    },
    summary: 'From paper ledgers to automated real-time fee tracking and parent communication: Ogbelekon is transforming primary and secondary school efficiency across Southern Nigeria.',
    content: [
      'When Osasere Idehen first visited primary schools across Edo and Delta states in 2024, administrators were spending over 20 hours each week reconciling paper receipt books, chasing tuition defaults, and printing report sheets.',
      'Through Óghowa’s Venture Studio, the founding team mapped school workflows from scratch. They built a lightweight offline-first application that functions even in areas with sporadic internet connectivity.',
      'Today, over 140 private and public schools use Ogbelekon to manage 45,000+ registered students, track ₦320M in termly collections, and reduce tuition delinquency by 42%.',
      '"The mentorship from Óghowa was pivotal," says Idehen. "They did not just teach us product metrics; they accompanied us into headmasters’ offices, helped negotiate pilot agreements, and connected us with payment infrastructure partners."'
    ],
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=70',
    tags: ['EdTech', 'Ogbelekon', 'Traction', 'Venture Studio'],
    featured: true
  },
  {
    id: 'news-3',
    title: 'Óghowa Annual Business Week 2026 to Convene Over 2,000 African Tech Leaders in Benin City',
    slug: 'annual-business-week-2026-announcement',
    category: 'Program Updates',
    date: 'September 28, 2026',
    readTime: '3 min read',
    author: {
      name: 'Ecosystem Desk',
      role: 'Events Director',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=80&h=80&crop=faces&q=70'
    },
    summary: 'The three-day gathering will feature masterclasses, the Great Venture Pitch Showcase, policy roundtables, and high-impact investor matchmaking.',
    content: [
      'Preparations are officially underway for the 2026 edition of Óghowa Business Week, scheduled to take place at the Victor Uwaifo Creative Hub.',
      'The theme for this year’s symposium is "Decentralized Growth: Building Pan-African Value from the Grassroots." Key speakers will include tech founders, venture capitalists from London, Lagos, and Nairobi, and policymakers driving the National Digital Economy policy.',
      'Registration opens next week for both in-person participants and virtual livestream attendees across the globe.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=70',
    tags: ['Business Week', 'Conference', 'Ecosystem', 'Networking']
  },
  {
    id: 'news-4',
    title: 'Edo State Tech Policy Report: How Digital Infrastructure Is Catalyzing Youth Employment',
    slug: 'edo-state-tech-policy-report-2026',
    category: 'Research & Insights',
    date: 'September 15, 2026',
    readTime: '6 min read',
    author: {
      name: 'Research & Policy Lab',
      role: 'Óghowa Policy Team',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&crop=faces&q=70'
    },
    summary: 'A comprehensive study tracking the economic multiplier effects of regional venture hubs, fiber network expansion, and startup talent retention.',
    content: [
      'The Óghowa Research & Policy Lab in collaboration with academic researchers at the University of Benin has released its 2026 Innovation Index.',
      'Key findings reveal that local tech ventures created over 3,200 direct digital jobs in the past 24 months, with software engineering, logistics management, and digital customer support ranking as the fastest-growing categories.',
      'The report highlights specific regulatory levers that can further accelerate startup creation, including municipal tax holidays for seed-stage startups and standardized data privacy sandboxes.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=70',
    tags: ['Policy', 'Research', 'Ecosystem', 'Jobs']
  },
  {
    id: 'news-5',
    title: 'Cyona Medicare Closes Seed Extension to Expand Tele-Diagnostics to 8 New Local Governments',
    slug: 'cyona-medicare-seed-extension-announcement',
    category: 'Venture Spotlight',
    date: 'August 30, 2026',
    readTime: '4 min read',
    author: {
      name: 'Venture Desk',
      role: 'Óghowa Editorial Team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&crop=faces&q=70'
    },
    summary: 'Healthcare tech pioneer Cyona Medicare announces fresh funding led by regional angel syndicates to launch rapid diagnostic mobile clinics and e-pharmacy deliveries.',
    content: [
      'Cyona Medicare, an alumnus of Óghowa Incubation Cohort 2025, has successfully closed an oversubscribed ₦45M seed extension round.',
      'With over 28,000 telemedicine consultations completed across Edo and neighbouring states, Cyona plans to expand into 8 underserved local government areas, connecting community patent medicine vendors with certified remote specialists.',
      'Dr. Blessing Osagie credited the intensive mentorship on healthcare compliance and institutional partnerships received during her time at Óghowa.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=70',
    tags: ['HealthTech', 'Fundraising', 'Cyona Medicare', 'Alumni']
  }
];

export const SAMPLE_APPLICATIONS: ApplicationSubmission[] = [
  {
    id: 'OGH-2026-0814',
    startupName: 'AgroTrack Nigeria',
    sector: 'Agritech & Supply Chain',
    stage: 'MVP / Early Traction',
    founderName: 'Emeka Nwosu',
    email: 'emeka@agrotrack.ng',
    phone: '+234 803 456 7890',
    city: 'Benin City, Nigeria',
    summary: 'IoT solar cold hubs and logistics tracking preventing post-harvest tomato and plantain loss in regional farm clusters.',
    traction: '₦4.2M GMV in Q3 2026 with 420 active smallholder farmers onboarded.',
    deckName: 'AgroTrack_PitchDeck_2026.pdf',
    status: 'Interview Scheduled',
    submittedAt: '2026-10-14',
    cohort: 'Cohort 2026-B',
    programTrack: 'Incubation Track',
    reviewerNotes: 'Strong unit economics and direct off-taker commitments. Invited to Pitch Evaluation on Oct 24.'
  },
  {
    id: 'OGH-2026-0792',
    startupName: 'SolarPay Microgrids',
    sector: 'Clean Energy & FinTech',
    stage: 'Pilot Stage',
    founderName: 'Amina Bello',
    email: 'amina@solarpay.africa',
    phone: '+234 812 987 6543',
    city: 'Ekpoma, Edo State',
    summary: 'Pay-as-you-go solar metering for off-grid student hostels and artisanal workshops.',
    traction: '60 pilot units deployed with 99.1% repayment rate via USSD and mobile wallets.',
    deckName: 'SolarPay_Deck_v3.pdf',
    status: 'Screening',
    submittedAt: '2026-10-11',
    cohort: 'Cohort 2026-B',
    programTrack: 'Venture Studio Track',
    reviewerNotes: 'Technical architecture verification in progress with AWS partner mentors.'
  }
];

export const PARTNERS_LIST: PartnerItem[] = [
  { id: 'p1', name: 'Edo State Government', category: 'Government', logo: '🏛️ Edo State Govt', isDisplayed: true, websiteUrl: 'https://edostate.gov.ng' },
  { id: 'p2', name: 'University of Benin', category: 'Academic', logo: '🎓 UNIBEN', isDisplayed: true, websiteUrl: 'https://uniben.edu' },
  { id: 'p3', name: 'Sterling Bank', category: 'Financial', logo: '🏦 Sterling Bank', isDisplayed: true, websiteUrl: 'https://sterling.ng' },
  { id: 'p4', name: 'Microsoft Africa', category: 'Technology', logo: '💻 Microsoft', isDisplayed: true, websiteUrl: 'https://microsoft.com' },
  { id: 'p5', name: 'Amazon Web Services', category: 'Cloud', logo: '☁️ AWS', isDisplayed: true, websiteUrl: 'https://aws.amazon.com' },
  { id: 'p6', name: 'MTN Nigeria', category: 'Telecom', logo: '📶 MTN', isDisplayed: true, websiteUrl: 'https://mtn.ng' },
  { id: 'p7', name: 'Dangote Group', category: 'Enterprise', logo: '🏭 Dangote', isDisplayed: true, websiteUrl: 'https://dangote.com' },
  { id: 'p8', name: 'GIZ Germany', category: 'Development', logo: '🌍 GIZ', isDisplayed: true, websiteUrl: 'https://giz.de' },
  { id: 'p9', name: 'Standard Chartered', category: 'Banking', logo: '💳 Standard Chartered', isDisplayed: true, websiteUrl: 'https://sc.com' },
  { id: 'p10', name: 'AFD France', category: 'Development', logo: '🤝 AFD', isDisplayed: true, websiteUrl: 'https://afd.fr' },
  { id: 'p11', name: 'NITDA', category: 'Government', logo: '🛡️ NITDA', isDisplayed: true, websiteUrl: 'https://nitda.gov.ng' },
  { id: 'p12', name: 'Bank of Industry', category: 'Financial', logo: '🏢 BOI', isDisplayed: true, websiteUrl: 'https://boi.ng' }
];

export const DEFAULT_CAROUSEL_EVENTS: CarouselSlide[] = [
  {
    id: 'event-startup-week',
    title: 'Óghowa Business Week 2026',
    subtitle: 'Innovation for Economic Transformation ...Our own',
    description: 'Join founders, investors, business leaders and innovators in collaboration with Benin Tech Fest for keynotes, masterclasses, startup pitches and networking in Edo State.',
    eventDate: 'Nov 16 - 21, 2026',
    location: 'Victor Uwaifo Creative Hub',
    badge: 'Flagship Summit',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=75',
    registerLink: '#register-event',
    seatsAvailable: 38,
    isDisplayed: true,
    order: 1
  },
  {
    id: 'event-startup-weekend',
    title: 'Óghowa Innovation Weekend',
    subtitle: '48-Hour Rapid Prototyping, Venture Ideation & Co-founder Matchmaking',
    description: 'Pitch ideas, form multi-disciplinary squads, build functional MVPs, and compete for ₦5,000,000 in equity-free grant financing and direct admission into Incubation.',
    eventDate: 'Dec 05 - 07, 2026',
    location: 'Victor Uwaifo Creative Hub',
    badge: 'Hackathon Sprint',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=75',
    registerLink: '#register-hackathon',
    seatsAvailable: 24,
    isDisplayed: true,
    order: 2
  },
  {
    id: 'event-pitch-day',
    title: 'Great Venture Pitch & Syndicate Deal Room',
    subtitle: '₦50M Pre-Seed & Seed Investment Showcase',
    description: 'Top cohort finalists present vetted metrics to Pan-African VC partners, angel syndicates, and institutional family offices in closed-door deal sessions.',
    eventDate: 'Jan 16, 2027',
    location: 'Victor Uwaifo Creative Hub',
    badge: 'Investor Deal Room',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=75',
    registerLink: '#register-dealroom',
    seatsAvailable: 15,
    isDisplayed: true,
    order: 3
  }
];

export const DEFAULT_BUSINESS_WEEK_CONFIG: BusinessWeekConfig = {
  summitTitle: 'Óghowa Business Week 2026',
  dates: 'November 16 – 21, 2026',
  venueName: 'Victor Uwaifo Creative Hub',
  venueAddress: 'Victor Uwaifo Creative Hub',
  dealFundAmount: '₦50,000,000',
  expectedDelegates: '2,500+',
  capacityWindowText: 'Limited Participants — Registrations are reviewed systematically by the secretariat.',
  isRegistrationOpen: true,
  tracks: [
    {
      id: 'digital_economy',
      tag: 'Pillar 01',
      title: 'Institutional Alignment & Policy Forum',
      desc: 'Decentralized economic growth, government partnerships, regulatory sandboxes, and modernizing sub-national trade channels.',
      isDisplayed: true
    },
    {
      id: 'agritech',
      tag: 'Pillar 02',
      title: 'Digital Infrastructure & Founder Blueprint',
      desc: 'The Edo Tech Stack, fiber expansion, cloud sovereignty, system architecture, and corporate governance for high-growth ventures.',
      isDisplayed: true
    },
    {
      id: 'investment_pitches',
      tag: 'Pillar 03',
      title: 'Venture Capital, Private Equity & Deal Syndicate',
      desc: 'Unlocking institutional and diaspora capital, reverse pitching, term sheet hygiene, and the ₦50M Deal Room.',
      isDisplayed: true
    },
    {
      id: 'demo_day',
      tag: 'Pillar 04',
      title: 'The Óghowa Demo Day & Grand Finale',
      desc: 'The top 10 vetted portfolio startups pitch live to Pan-African investors, with ecosystem awards and capital co-investments.',
      isDisplayed: true
    }
  ],
  speakers: [
    {
      id: 'spk-1',
      name: 'Dr. Aisosa Edebiri',
      role: 'Managing Partner, Sahara Frontier Capital',
      topic: 'Sub-National Venture Economics & Early-Stage Syndicates',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      isDisplayed: true
    },
    {
      id: 'spk-2',
      name: 'Osagie Egharevba',
      role: 'Founder & CEO, Benin Mobility Tech',
      topic: 'Building Clean Transport Infrastructure for Tier-2 Cities',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isDisplayed: true
    },
    {
      id: 'spk-3',
      name: 'Engr. Osayande Ighodaro',
      role: 'Director of Technology, Edo State Innovation Hub',
      topic: 'Bridging Academic Research & High-Growth Commercial Startups',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isDisplayed: true
    },
    {
      id: 'spk-4',
      name: 'Nosa Igiehon',
      role: 'Principal, Great Benin Creative Fund',
      topic: 'Commercialising African Cultural IP and Digital Media',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      isDisplayed: true
    }
  ],
  schedule: [
    {
      day: 1,
      title: 'Day 1: The Macro-Economy, Commerce & Policy Forum',
      date: 'Monday, 16 November 2026',
      theme: 'Institutional Alignment & Sub-National Commerce',
      events: [
        { time: '08:30 – 09:30 AM', title: 'Accreditation, Networking & Exhibition Walkthrough', speaker: 'Summit Secretariat' },
        { time: '09:30 – 10:15 AM', title: 'Grand Opening & Welcome Address', speaker: 'Metaspace / Óghowa Team & ESIPO' },
        { time: '10:15 – 11:30 AM', title: 'Keynote & High-Level Policy Dialogue: "Decentralized Economic Growth: Positioning Edo as West Africa\'s Innovation Gateway"', speaker: 'Government Leaders & Key Stakeholders' },
        { time: '11:45 – 01:15 PM', title: 'Trade & Commerce Panel: Modernizing Sub-National Trade Channels, Cross-Border Payments, and Logistics', speaker: 'Ministry of Trade, Commercial Bank Directors & Logistics Operators' },
        { time: '01:15 – 02:15 PM', title: 'Executive Networking Lunch & Curated Deal Lounge', speaker: 'VIP Delegation' },
        { time: '02:15 – 03:45 PM', title: 'Bank of Industry & Development Finance Masterclass: Accessing Catalytic Capital & iDICE Fund Allocations', speaker: 'BOI & Development Partners' },
        { time: '03:45 – 04:45 PM', title: 'Day 1 Fireside Chat & Day Close', speaker: 'Industry Pioneers' }
      ]
    },
    {
      day: 2,
      title: 'Day 2: Digital Infrastructure, Tech Policy & The Founder’s Blueprint',
      date: 'Tuesday, 17 November 2026',
      theme: 'Sovereignty, Scalable Systems & Legal Compliance',
      events: [
        { time: '09:00 – 09:30 AM', title: 'Morning Keynote: The Edo Tech Stack — Fiber Expansion, Cloud Sovereignty & Public Digital Goods', speaker: 'Edo ICTA & Edo Cloud' },
        { time: '09:30 – 11:00 AM', title: 'Digital Economy Policy Roundtable: National Startup Act State-Level Adoption & Regulatory Sandboxes', speaker: 'MDEST, NITDA & Gates Foundation Initiative' },
        { time: '11:15 – 01:00 PM', title: 'Masterclass 1: Product-Market Fit & Scalable System Architecture for Frontier Markets', speaker: 'Senior Tech Leads & CTOs' },
        { time: '01:00 – 02:00 PM', title: 'Lunch Break & Live Exhibition Showcase', speaker: 'All Delegates' },
        { time: '02:00 – 03:30 PM', title: 'Masterclass 2: Corporate Governance, Tax Structuring & Legal Compliance Clinic', speaker: 'Legal & Tax Practitioners' },
        { time: '03:30 – 05:00 PM', title: 'Panel Session: "Tech in the Trenches — Building Resilient Systems in AgriTech, Mobility & Commodity Trade"', speaker: 'Frontline Founders' }
      ]
    },
    {
      day: 3,
      title: 'Day 3: Venture Capital & Private Equity Day',
      date: 'Thursday, 19 November 2026',
      theme: 'Capital Mobilization & Term Sheet Hygiene',
      events: [
        { time: '09:00 – 09:45 AM', title: 'Morning Plenary: Unlocking Institutional & Diaspora Capital for Sub-National Ecosystems', speaker: 'Capital Network Leads' },
        { time: '09:45 – 11:15 AM', title: 'Investor Panel: What Frontier Investors Look for Beyond Coastal Megacities', speaker: 'Leading West African VCs & Angel Networks' },
        { time: '11:30 – 01:00 PM', title: 'The Masterclass: Deconstructing the Term Sheet — SAFEs, Valuations, Liquidation Preferences & Cap Table Hygiene', speaker: 'Venture Partners & Syndicate Leads' },
        { time: '01:00 – 02:00 PM', title: 'VIP Investor Networking Luncheon', speaker: 'Accredited Investors & Founders' },
        { time: '02:00 – 04:30 PM', title: 'Closed Reverse Pitching & Deal Room Sessions: Fund Managers Pitch Their Theses to Pre-Screened Founders', speaker: 'Fund Managers & Finalist Founders' }
      ]
    },
    {
      day: 4,
      title: 'Day 4: Grand Finale & Demo Day',
      date: 'Saturday, 21 November 2026',
      theme: 'The Óghowa Demo Day & Ecosystem Awards',
      events: [
        { time: '09:30 – 10:15 AM', title: 'Arrival, Live Exhibition & Tech Experience Pavilion', speaker: 'Summit Delegates & Guests' },
        { time: '10:15 – 11:00 AM', title: 'Opening Keynote: 2030+ Operational Outlook: Building Sustainable Prosperity in Edo State', speaker: 'Keynote Speaker' },
        { time: '11:00 – 01:30 PM', title: 'The Main Event: The Óghowa Demo Day (Top 10 Vetted Portfolio Startups Pitch to Local & International Investor Panel)', speaker: 'Cohort Finalists & Judges' },
        { time: '01:30 – 02:30 PM', title: 'Lunch, Deliberations & Live Audience Choice Voting', speaker: 'Delegates & Evaluation Jury' },
        { time: '02:30 – 04:00 PM', title: 'Closing Ceremony, Ecosystem Awards, ₦50M+ Syndicate Co-Investment Commitments Announcement & Official Communiqué', speaker: 'Óghowa Investment Committee & Partners' }
      ]
    }
  ],
  delegates: []
};

