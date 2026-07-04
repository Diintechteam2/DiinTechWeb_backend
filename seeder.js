const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
require('colors');

// Load models
const Hero = require('./models/Hero');
const Project = require('./models/Project');
const Solution = require('./models/Solution');
const Admin = require('./models/Admin');
const GlobalSettings = require('./models/GlobalSettings');
const Industry = require('./models/Industry');
const SiteContent = require('./models/SiteContent');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// --- Full Static Data from Frontend ---

const heroData = {
  badgeText: 'Next-Generation Agentic AI',
  mainHeading: 'We Build AI Systems That Run Businesses',
  subHeading: 'Diin Technologies designs autonomous AI agents that think, plan, act, and learn — delivering real, measurable business outcomes for enterprise organizations.',
  stats: [
    { value: '6+', label: 'Years Experience' },
    { value: '50+', label: 'AI Agents Deployed' },
    { value: '10M+', label: 'Tasks Automated' },
    { value: '99.9%', label: 'Uptime SLA' }
  ],
  ctaButtons: [
    { text: 'Book a Strategy Call', link: '#', variant: 'primary' },
    { text: 'Watch Demo', link: '#', variant: 'outline' }
  ]
};

const solutionsData = [
  {
    icon: 'TrendingUp',
    title: 'AI Sales & Growth Agents',
    description: 'Autonomous lead qualification, AI voice & chat follow-ups, CRM updates & deal tracking, revenue forecasting.',
    features: ['Lead Qualification', 'Voice & Chat AI', 'CRM Automation', 'Revenue Intelligence'],
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
    order: 1
  },
  {
    icon: 'Headphones',
    title: 'AI Customer Support Agents',
    description: '24×7 voice & chat support, context-aware conversations, ticket resolution & escalation, omnichannel support.',
    features: ['24/7 Availability', 'Context Awareness', 'Auto-Resolution', 'Omnichannel'],
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-blue-500/30',
    order: 2
  },
  {
    icon: 'Settings',
    title: 'AI Operations Agents',
    description: 'Workflow orchestration, task allocation & monitoring, internal reporting, process optimization.',
    features: ['Workflow Automation', 'Task Management', 'Analytics', 'Optimization'],
    color: 'from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-500/30',
    order: 3
  },
  {
    icon: 'Database',
    title: 'AI Knowledge & RAG Systems',
    description: 'Enterprise knowledge ingestion, secure vector search, policy-aware AI responses, internal AI copilots.',
    features: ['Knowledge Graphs', 'Vector Search', 'Policy Compliance', 'AI Copilots'],
    color: 'from-purple-500/20 to-fuchsia-500/20',
    borderColor: 'border-purple-500/30',
    order: 4
  },
  {
    icon: 'Cog',
    title: 'Custom Enterprise AI',
    description: 'Fully tailored agent ecosystems, API & system integrations, cloud & on-prem deployment, scalable architectures.',
    features: ['Custom Agents', 'API Integrations', 'Flexible Deployment', 'Scalable'],
    color: 'from-fuchsia-500/20 to-cyan-500/20',
    borderColor: 'border-fuchsia-500/30',
    order: 5
  }
];

const projectsData = [
  {
    slug: "badhai",
    name: "BadhAI",
    websiteUrl: "#",
    logoUrl: "",
    lastUpdated: "04/04/2026",
    content: {
      introduction: "BadhAI (\"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.",
      informationCollect: {
        personal: ["Name (if provided)", "Email address", "Phone number"],
        userContent: ["Photos uploaded by users", "Content submitted for reel creation"],
        deviceUsage: ["Device type and operating system", "App usage data"]
      },
      howWeUse: [
        "To provide reel creation services",
        "To process user requests",
        "To deliver created reels",
        "To improve app performance",
        "To communicate with users if required"
      ],
      dataSharing: [
        "We do not sell user data.",
        "We may share data only with internal team/admin for processing requests and service providers (hosting, analytics)."
      ],
      dataSecurity: "We take reasonable security measures to protect your data. All data transmission is encrypted using secure protocols (HTTPS).",
      dataRetention: "We retain user data only as long as necessary to provide services and fulfill user requests.",
      dataDeletion: {
        instruction: "Users can request deletion of their data at any time.",
        email: "contact@diintech.com",
        subject: "Delete my user details for BadhAI app"
      },
      childrenPrivacy: "BadhAI is not intended for children under the age of 13. We do not knowingly collect data from children.",
      thirdParty: "We may use third-party services such as Firebase and cloud storage providers. These services may process data according to their own privacy policies.",
      changesToPolicy: "We may update this Privacy Policy from time to time. Users are advised to review this page periodically.",
      contactUs: {
        instruction: "If you have any questions, contact us at:",
        email: "contact@diintech.com"
      }
    }
  },
  {
    slug: "yovoai",
    name: "YovoAI",
    websiteUrl: "https://viralstatus-frontend.vercel.app/landingpage",
    logoUrl: "",
    lastUpdated: "06/04/2026",
    content: {
      introduction: "YovoAI (\"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and related services.",
      informationCollect: {
        personal: ["Name (if provided)", "Email address", "Phone number (if provided)"],
        userContent: [
          "Text prompts submitted by users",
          "Images uploaded by users",
          "AI-generated images and related content",
          "Any content submitted for processing through the app"
        ],
        deviceUsage: [
          "Device type and operating system",
          "App usage data",
          "Log information such as crashes, access times, and app activity"
        ]
      },
      howWeUse: [
        "To provide AI image generation and related services",
        "To process user prompts and uploaded content",
        "To generate and deliver AI-created images",
        "To improve app performance and user experience",
        "To communicate with users if required",
        "To maintain app security and prevent misuse"
      ],
      dataSharing: [
        "We do not sell user data.",
        "We may share data only with:",
        "Internal team/admin for processing app services",
        "Service providers (hosting, cloud storage, analytics, AI processing services)",
        "Legal authorities if required by law"
      ],
      dataSecurity: "We take reasonable security measures to protect your data. All data transmission is encrypted using secure protocols (HTTPS).",
      dataRetention: "We retain user data only as long as necessary to provide services, improve the app, and fulfill user requests or legal obligations.",
      dataDeletion: {
        instruction: "Users can request deletion of their data at any time. To request deletion, email us at:",
        email: "contact@diintech.com",
        subject: "Delete my user details for YovoAI app"
      },
      childrenPrivacy: "YovoAI is not intended for children under the age of 13. We do not knowingly collect data from children.",
      thirdParty: "We may use third-party services such as Firebase, cloud storage providers, analytics tools, and AI service providers. These services may process data according to their own privacy policies.",
      disclaimer: "YovoAI provides AI-generated content based on user inputs. While we strive to offer high-quality results, we do not guarantee the accuracy, originality, or suitability of AI-generated outputs for every purpose.",
      changesToPolicy: "We may update this Privacy Policy from time to time. Users are advised to review this page periodically for any changes.",
      contactUs: {
        instruction: "If you have any questions, contact us at:",
        email: "contact@diintech.com"
      }
    }
  },
  {
    slug: "myaiads",
    name: "My AI Ads",
    websiteUrl: "https://myaiads.diintech.com/",
    logoUrl: "",
    lastUpdated: "06/04/2026",
    content: {
      introduction: "My AI Ads (\"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application, website, and related services.",
      informationCollect: {
        personal: ["Name (if provided)", "Email address", "Phone number (if provided)"],
        userContent: [
          "Text prompts submitted by users",
          "Marketing content inputs",
          "Product details, brand details, or business information entered by users",
          "Images, logos, or media uploaded by users",
          "AI-generated ad creatives, captions, copies, or visual outputs"
        ],
        deviceUsage: [
          "Device type and operating system",
          "App usage data",
          "Log information such as crashes, access times, and feature usage"
        ]
      },
      howWeUse: [
        "To provide AI-powered ad and creative generation services",
        "To process user prompts and uploaded media",
        "To generate marketing creatives, captions, ad copies, and related content",
        "To improve app performance and user experience",
        "To communicate with users if required",
        "To maintain security and prevent misuse of the platform"
      ],
      dataSharing: [
        "We do not sell user data.",
        "We may share data only with:",
        "Internal team/admin for processing and support",
        "Service providers (hosting, analytics, cloud storage, AI processing services)",
        "Legal authorities if required by law"
      ],
      dataSecurity: "We take reasonable security measures to protect your data. All data transmission is encrypted using secure protocols (HTTPS).",
      dataRetention: "We retain user data only as long as necessary to provide services, improve our platform, and fulfill legal or operational obligations.",
      dataDeletion: {
        instruction: "Users can request deletion of their data at any time. To request deletion, email us at:",
        email: "contact@diintech.com",
        subject: "Delete my user details for MY AI Ads app"
      },
      childrenPrivacy: "My AI Ads is not intended for children under the age of 13. We do not knowingly collect personal data from children.",
      thirdParty: "We may use third-party services such as Firebase, analytics tools, cloud storage providers, and AI service providers. These services may process data according to their own privacy policies.",
      disclaimer: "My AI Ads provides AI-generated marketing and advertising content based on user inputs. While we strive to provide useful and high-quality outputs, we do not guarantee the accuracy, originality, legal compliance, or suitability of AI-generated content for every advertising or commercial use case.",
      changesToPolicy: "We may update this Privacy Policy from time to time. Users are advised to review this page periodically.",
      contactUs: {
        instruction: "If you have any questions, contact us at:",
        email: "contact@diintech.com"
      }
    }
  },
  {
    slug: "tryoai",
    name: "TryoAI",
    websiteUrl: "#",
    logoUrl: "",
    lastUpdated: "06/04/2026",
    content: {
      introduction: "TryoAI (\"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application, website, and related services.",
      informationCollect: {
        personal: ["Name (if provided)", "Email address", "Phone number (if provided)"],
        userContent: [
          "User-uploaded photos",
          "Outfit, clothing, or style selections made by users",
          "Body appearance or pose-related image inputs (only for virtual try-on processing)",
          "AI-generated outfit preview images",
          "Any content submitted for styling or virtual try-on purposes"
        ],
        deviceUsage: [
          "Device type and operating system",
          "App usage data",
          "Log information such as crashes, access times, and feature usage"
        ]
      },
      howWeUse: [
        "To provide AI-powered virtual try-on and outfit preview services",
        "To process uploaded user photos and outfit selections",
        "To generate clothing try-on previews and styling results",
        "To improve app performance and user experience",
        "To communicate with users if required",
        "To maintain app security and prevent misuse of the platform"
      ],
      imageProcessing: "TryoAI uses artificial intelligence and image processing technology to create outfit previews based on user-uploaded images and selected clothing styles. Uploaded photos are used only for generating virtual try-on results, improving service functionality, and supporting app features.",
      dataSharing: [
        "We do not sell user data.",
        "We may share data only with:",
        "Internal team/admin for support and service operations",
        "Service providers (hosting, analytics, cloud storage, AI/image processing services)",
        "Legal authorities if required by law"
      ],
      dataSecurity: "We take reasonable security measures to protect your data. All data transmission is encrypted using secure protocols (HTTPS).",
      dataRetention: "We retain uploaded images and related user data only as long as necessary to provide services, improve the app, and fulfill legal or operational obligations.",
      dataDeletion: {
        instruction: "Users can request deletion of their data at any time. To request deletion, email us at:",
        email: "contact@diintech.com",
        subject: "Delete my user details for TryoAI app"
      },
      childrenPrivacy: "TryoAI is not intended for children under the age of 13. We do not knowingly collect personal data from children.",
      thirdParty: "We may use third-party services such as Firebase, cloud storage providers, analytics tools, and AI/image processing service providers. These services may process data according to their own privacy policies.",
      disclaimer: "TryoAI provides AI-generated outfit previews based on user-uploaded photos and selected clothing inputs. These results are intended for visualization purposes only and may not exactly reflect real-life fit, fabric behavior, body proportions, or final appearance.",
      changesToPolicy: "We may update this Privacy Policy from time to time. Users are advised to review this page periodically for any changes.",
      contactUs: {
        instruction: "If you have any questions, contact us at:",
        email: "contact@diintech.com"
      }
    }
  }
];

const industriesData = [
  {
    title: 'Education & EdTech',
    description: 'AI tutors, AI mentors, content agents, admissions automation.',
    icon: 'GraduationCap',
    order: 1
  },
  {
    title: 'BFSI & FinTech',
    description: 'Compliance agents, risk analysis, customer onboarding AI.',
    icon: 'Building2',
    order: 2
  },
  {
    title: 'Healthcare',
    description: 'Scheduling agents, patient engagement, operations intelligence.',
    icon: 'Heart',
    order: 3
  },
  {
    title: 'BPO & Call Centers',
    description: 'AI calling agents, QA automation, performance optimization.',
    icon: 'Headphones',
    order: 4
  },
  {
    title: 'Enterprises & Startups',
    description: 'End-to-end AI workforce deployment for any industry.',
    icon: 'Rocket',
    order: 5
  }
];

const globalSettingsData = {
  email: 'contact@diintech.com',
  phone: '+91 81475 40362',
  address: 'C-116, Sector-2, Noida, Uttar Pradesh – 201301, India',
  whatsapp: {
    number: '+919876543210',
    message: "Hello! I'm interested in Diin Technologies' Agentic AI solutions."
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/company/diintech',
    twitter: 'https://twitter.com/diintech',
    instagram: 'https://instagram.com/diintech'
  }
};

const siteContentData = {
  header: {
    solutionMenu: [
      {
        label: 'AI Sales Agents',
        description: 'Autonomous lead qualification and revenue optimization',
        href: '/#solutions'
      },
      {
        label: 'AI Support Agents',
        description: '24x7 intelligent customer support',
        href: '/#solutions'
      },
      {
        label: 'AI Operations Agents',
        description: 'Workflow orchestration and automation',
        href: '/#solutions'
      },
      {
        label: 'AI Knowledge & RAG',
        description: 'Enterprise knowledge systems',
        href: '/#solutions'
      }
    ],
    industryMenu: [
      { label: 'Education & EdTech', href: '/#industries' },
      { label: 'BFSI & FinTech', href: '/#industries' },
      { label: 'Healthcare', href: '/#industries' },
      { label: 'BPO & Call Centers', href: '/#industries' }
    ],
    navLinks: [
      { label: 'About', href: '/#about' },
      { label: 'Technology', href: '/#technology' },
      { label: 'Why Diin', href: '/#why-diin' }
    ],
    contactButtonText: 'Contact',
    ctaButtonText: 'Book a Strategy Call'
  },
  logoCloud: {
    introText: 'Trusted by innovative companies worldwide',
    logos: [
      { name: 'TechCorp', initials: 'TC' },
      { name: 'InnovateLabs', initials: 'IL' },
      { name: 'DataDriven', initials: 'DD' },
      { name: 'ScaleUp', initials: 'SU' },
      { name: 'FutureAI', initials: 'FA' },
      { name: 'CloudFirst', initials: 'CF' }
    ]
  },
  differenceSection: {
    badgeText: 'The Diin Difference',
    titleLineOne: "We Don't Automate Tasks.",
    titleHighlight: 'We Build AI Workforces.',
    description: 'Traditional automation follows rules. Our Agentic AI understands goals and achieves them autonomously.',
    traditionalTitle: 'Traditional Automation',
    diinTitle: "Diin's Agentic AI",
    comparisons: [
      { traditional: 'Rule-based workflows', diin: 'Goal-driven intelligence' },
      { traditional: 'Human-dependent', diin: 'Autonomous execution' },
      { traditional: 'Isolated tools', diin: 'Multi-agent ecosystems' },
      { traditional: 'Static logic', diin: 'Self-learning systems' }
    ]
  },
  agenticSection: {
    badgeText: 'Agentic AI',
    title: 'AI With Agency',
    description: 'Agentic AI refers to AI systems capable of independent decision-making and action. This is AI that thinks, plans, acts, and learns.',
    features: [
      {
        icon: 'Brain',
        title: 'Autonomous Decision-Making',
        description: 'AI systems capable of independent decision-making and action. Unlike traditional AI that waits for prompts, agentic AI understands goals and achieves them.'
      },
      {
        icon: 'Users',
        title: 'Multi-Agent Collaboration',
        description: 'Collaborative AI agents, each responsible for specific roles: Planner Agents, Executor Agents, Evaluator Agents, and Memory Agents working together.'
      },
      {
        icon: 'Shield',
        title: 'Human-in-the-Loop Control',
        description: 'Governance, approvals, auditability, ethical AI behavior, and override mechanisms ensure safe and controlled AI operations.'
      },
      {
        icon: 'Sparkles',
        title: 'Self-Learning Systems',
        description: 'Our agents learn from outcomes, continuously improving their performance and adapting to new challenges without manual intervention.'
      }
    ]
  },
  solutionsSection: {
    badgeText: 'Solutions',
    title: 'AI Agents for Every Business Function',
    description: 'Deploy autonomous AI agents across your organization to transform operations, enhance customer experience, and drive growth.',
    primaryButtonText: 'Explore All Solutions'
  },
  industriesSection: {
    badgeText: 'Industries',
    title: 'AI Solutions Across Sectors',
    description: 'We deploy intelligent AI agents tailored to the unique challenges and opportunities in your industry.'
  },
  technologySection: {
    badgeText: 'Technology',
    titleLineOne: 'Enterprise-Grade',
    titleHighlight: 'AI Infrastructure',
    description: 'Built on cutting-edge AI technologies with enterprise security and compliance at its core.',
    techStack: [
      { icon: 'Cpu', label: 'Large Language Models (LLMs)' },
      { icon: 'Server', label: 'Multi-Agent Frameworks' },
      { icon: 'Database', label: 'Vector Databases & RAG' },
      { icon: 'Zap', label: 'Voice AI (STT + TTS)' },
      { icon: 'Cloud', label: 'Cloud-Native Microservices' },
      { icon: 'Shield', label: 'Enterprise Security' }
    ],
    architectureTitle: 'Architecture & Security',
    architectureFeatures: [
      'Modular & Scalable',
      'API-First Design',
      'Secure & Fault-Tolerant',
      'Role-Based Access Control',
      'Data Encryption at Rest & Transit',
      'Comprehensive Audit Logs'
    ],
    securityTitle: 'Security & Compliance',
    securityDescription: 'SOC 2 compliant infrastructure with end-to-end encryption, GDPR-ready data handling, and comprehensive audit trails.'
  },
  processSection: {
    badgeText: 'Our Process',
    title: 'From Vision to Autonomous Reality',
    description: 'A proven methodology for delivering enterprise AI solutions that work from day one.',
    steps: [
      {
        icon: 'Search',
        number: '01',
        title: 'Discovery & Strategy',
        description: 'Deep dive into your business processes, challenges, and goals to define the AI roadmap.'
      },
      {
        icon: 'PenTool',
        number: '02',
        title: 'Agent Design & Architecture',
        description: 'Design multi-agent systems tailored to your specific workflows and requirements.'
      },
      {
        icon: 'Code',
        number: '03',
        title: 'Development & Training',
        description: 'Build, train, and fine-tune AI agents using your data and domain knowledge.'
      },
      {
        icon: 'Rocket',
        number: '04',
        title: 'Deployment & Integration',
        description: 'Seamlessly integrate AI agents into your existing systems and workflows.'
      },
      {
        icon: 'LineChart',
        number: '05',
        title: 'Monitoring & Optimization',
        description: 'Continuous monitoring, performance tracking, and iterative improvements.'
      }
    ]
  },
  whyDiinSection: {
    badgeText: 'Why Diin',
    title: 'Your Partner in AI Transformation',
    description: "We're not just another AI vendor. We're builders who understand that AI must deliver real business value.",
    reasons: [
      {
        icon: 'Clock',
        title: '6+ Years of Excellence',
        description: 'Battle-tested expertise in AI and software development.'
      },
      {
        icon: 'Target',
        title: 'Agentic-First Mindset',
        description: 'We think in autonomous agents, not just automation scripts.'
      },
      {
        icon: 'Rocket',
        title: 'Business Outcome Driven',
        description: 'We measure success by your business metrics, not technical vanity.'
      },
      {
        icon: 'Shield',
        title: 'Enterprise-Ready Systems',
        description: 'Security, compliance, and scalability built from the ground up.'
      },
      {
        icon: 'Users',
        title: 'End-to-End Ownership',
        description: 'From strategy to deployment to optimization â€” we own it all.'
      },
      {
        icon: 'Award',
        title: 'Builders, Not Experimenters',
        description: 'Production-grade AI that works in the real world, today.'
      }
    ]
  },
  ctaSection: {
    titleLineOne: 'Ready to Deploy AI Agents',
    titleHighlight: 'That Actually Work?',
    description: "Let's discuss how Diin's Agentic AI can transform your business operations and drive measurable results.",
    primaryButton: {
      text: 'Book a Free Strategy Session',
      link: '#'
    },
    secondaryButton: {
      text: 'Contact Sales',
      link: '#'
    },
    trustIndicators: [
      'No commitment required',
      '30-minute discovery call',
      'Custom solutions discussed'
    ]
  },
  footer: {
    brandText: 'Technologies Pvt. Ltd.',
    description: 'Disruptive Innovation Through Autonomous Intelligence. Building AI agents that run businesses â€” not just assist them.',
    solutionLinks: [
      { label: 'AI Sales Agents', href: '/#solutions' },
      { label: 'AI Support Agents', href: '/#solutions' },
      { label: 'AI Operations Agents', href: '/#solutions' },
      { label: 'Custom Enterprise AI', href: '/#solutions' }
    ],
    companyLinks: [
      { label: 'About Us', href: '/#about' },
      { label: 'Technology', href: '/#technology' },
      { label: 'Industries', href: '/#industries' },
      { label: 'Why Diin', href: '/#why-diin' },
      { label: 'Projects', href: '/projects' }
    ],
    legalLinks: [
      { label: 'Privacy Policy', href: '/#legal' },
      { label: 'Terms of Service', href: '/#legal' },
      { label: 'Security', href: '/#legal' }
    ],
    copyrightText: '© {{year}} Diin Technologies Pvt. Ltd. All rights reserved.'
  },
  projectsPage: {
    backLinkText: 'Back to Home',
    titlePrefix: 'Our',
    titleHighlight: 'Projects',
    description: 'Explore the products and applications built by Diin Technologies to solve real-world problems through autonomous intelligence.',
    visitWebsiteLabel: 'Visit Website',
    privacyPolicyLabel: 'Privacy Policy'
  },
  privacyPolicyTemplate: {
    breadcrumbProjectsLabel: 'Projects',
    breadcrumbPolicyLabel: 'Privacy Policy',
    complianceBadgeText: 'Legal Compliance',
    titlePrefix: 'Privacy Policy for',
    organizationLine: 'A unit of Diin Technology',
    effectiveDateLabel: 'Last Updated:',
    sections: {
      introduction: 'Introduction',
      informationWeCollect: 'Information We Collect',
      personalSubheading: 'a. Personal',
      userContentSubheading: 'b. User Content',
      deviceUsageSubheading: 'c. Device & Usage',
      howWeUse: 'How We Use Your Information',
      imageProcessing: 'Image Processing & AI Use',
      dataSharing: 'Data Sharing',
      dataSecurity: 'Data Security',
      dataRetention: 'Data Retention',
      userDataDeletion: 'User Data Deletion',
      requestEmailLabel: 'Request Email',
      subjectLabel: 'Subject:',
      childrenPrivacy: "Children's Privacy",
      thirdPartyServices: 'Third-Party Services',
      aiDisclaimer: 'AI-Generated Results Disclaimer',
      changesToPolicy: 'Changes to This Policy',
      contactUs: 'Contact Us'
    }
  }
};

// Import into DB
const importData = async () => {
  try {
    await Hero.deleteMany();
    await Project.deleteMany();
    await Solution.deleteMany();
    await Industry.deleteMany();
    await Admin.deleteMany();
    await GlobalSettings.deleteMany();
    await SiteContent.deleteMany();

    await Hero.create(heroData);
    await Project.create(projectsData);
    await Solution.create(solutionsData);
    await Industry.create(industriesData);
    await GlobalSettings.create(globalSettingsData);
    await SiteContent.create(siteContentData);
    
    // Create Default Admin
    await Admin.create({
      name: 'DiinTech Admin',
      email: process.env.ADMIN_EMAIL || 'admin@diintech.com',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    });

    console.log('Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

// Delete Data
const destroyData = async () => {
  try {
    await Hero.deleteMany();
    await Project.deleteMany();
    await Solution.deleteMany();
    await Industry.deleteMany();
    await Admin.deleteMany();
    await GlobalSettings.deleteMany();
    await SiteContent.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
