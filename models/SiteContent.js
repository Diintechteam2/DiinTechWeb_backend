const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
  {
    label: String,
    href: String,
    description: String
  },
  { _id: false }
);

const iconItemSchema = new mongoose.Schema(
  {
    icon: String,
    title: String,
    description: String,
    label: String,
    name: String,
    initials: String,
    number: String
  },
  { _id: false }
);

const buttonSchema = new mongoose.Schema(
  {
    text: String,
    link: String
  },
  { _id: false }
);

const SiteContentSchema = new mongoose.Schema({
  header: {
    solutionMenu: [linkSchema],
    industryMenu: [linkSchema],
    navLinks: [linkSchema],
    contactButtonText: String,
    ctaButtonText: String
  },
  logoCloud: {
    introText: String,
    logos: [iconItemSchema]
  },
  differenceSection: {
    badgeText: String,
    titleLineOne: String,
    titleHighlight: String,
    description: String,
    traditionalTitle: String,
    diinTitle: String,
    comparisons: [
      new mongoose.Schema(
        {
          traditional: String,
          diin: String
        },
        { _id: false }
      )
    ]
  },
  agenticSection: {
    badgeText: String,
    title: String,
    description: String,
    features: [iconItemSchema]
  },
  solutionsSection: {
    badgeText: String,
    title: String,
    description: String,
    primaryButtonText: String
  },
  industriesSection: {
    badgeText: String,
    title: String,
    description: String
  },
  technologySection: {
    badgeText: String,
    titleLineOne: String,
    titleHighlight: String,
    description: String,
    techStack: [iconItemSchema],
    architectureTitle: String,
    architectureFeatures: [String],
    securityTitle: String,
    securityDescription: String
  },
  processSection: {
    badgeText: String,
    title: String,
    description: String,
    steps: [iconItemSchema]
  },
  whyDiinSection: {
    badgeText: String,
    title: String,
    description: String,
    reasons: [iconItemSchema]
  },
  ctaSection: {
    titleLineOne: String,
    titleHighlight: String,
    description: String,
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema,
    trustIndicators: [String]
  },
  footer: {
    brandText: String,
    description: String,
    solutionLinks: [linkSchema],
    companyLinks: [linkSchema],
    legalLinks: [linkSchema],
    copyrightText: String
  },
  projectsPage: {
    backLinkText: String,
    titlePrefix: String,
    titleHighlight: String,
    description: String,
    visitWebsiteLabel: String,
    privacyPolicyLabel: String
  },
  privacyPolicyTemplate: {
    breadcrumbProjectsLabel: String,
    breadcrumbPolicyLabel: String,
    complianceBadgeText: String,
    titlePrefix: String,
    organizationLine: String,
    effectiveDateLabel: String,
    sections: {
      introduction: String,
      informationWeCollect: String,
      personalSubheading: String,
      userContentSubheading: String,
      deviceUsageSubheading: String,
      howWeUse: String,
      imageProcessing: String,
      dataSharing: String,
      dataSecurity: String,
      dataRetention: String,
      userDataDeletion: String,
      requestEmailLabel: String,
      subjectLabel: String,
      childrenPrivacy: String,
      thirdPartyServices: String,
      aiDisclaimer: String,
      changesToPolicy: String,
      contactUs: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SiteContent', SiteContentSchema);
