const siteUrl = 'https://ai.isaure-lohest.com';

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#isaure-lohest`,
  name: 'Isaure Lohest',
  jobTitle: 'AI Integration Engineer',
  description:
    'Isaure Lohest builds practical AI integrations for SaaS products, admin workflows, CRM enrichment, document analysis, routing, messaging systems, and operational automation.',
  url: `${siteUrl}/`,
  image: `${siteUrl}/favicon.png`,
  email: 'mailto:isaure.lohest@gmail.com',
  sameAs: ['https://isaure-lohest.com/'],
  knowsAbout: [
    'AI integration engineering',
    'AI inside SaaS products',
    'workflow automation',
    'CRM enrichment',
    'lead scoring',
    'document analysis',
    'request routing and triage',
    'semantic search',
    'messaging integrations',
    'Telegram automation',
    'WhatsApp automation',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'AI Integration Engineer',
    description:
      'Designs and implements AI features inside existing products, workflows, and internal tools.',
    skills: [
      'AI workflow design',
      'product integration',
      'document extraction',
      'lead qualification',
      'CRM automation',
      'internal copilots',
      'retrieval and semantic search',
    ],
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'Isaure Lohest - AI Integration Engineer',
  url: `${siteUrl}/`,
  description:
    'AI integration engineering portfolio focused on SaaS workflows, messaging systems, CRM enrichment, document analysis, routing, and operational automation.',
  inLanguage: 'en',
  publisher: {
    '@id': `${siteUrl}/#isaure-lohest`,
  },
};

export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteUrl}/#ai-integration-service`,
  name: 'Isaure Lohest AI Integration Engineering',
  url: `${siteUrl}/`,
  email: 'mailto:isaure.lohest@gmail.com',
  image: `${siteUrl}/favicon.png`,
  founder: {
    '@id': `${siteUrl}/#isaure-lohest`,
  },
  areaServed: {
    '@type': 'Place',
    name: 'Remote, Europe, and international product teams',
  },
  serviceType: [
    'AI integration engineering',
    'AI workflow automation',
    'AI features for SaaS products',
    'CRM enrichment and lead scoring',
    'document analysis automation',
    'request routing and triage',
    'internal AI tools',
    'messaging automation',
  ],
  description:
    'Design and implementation of AI systems that fit inside real products, admin flows, CRMs, messaging stacks, and operational workflows.',
  makesOffer: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'AI inside SaaS products',
        description:
          'AI summaries, classifications, contextual actions, and admin insights integrated into existing product interfaces.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Workflow automation',
        description:
          'AI-assisted pipelines for document extraction, request routing, CRM enrichment, and operational reporting.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Messaging and CRM integrations',
        description:
          'Telegram, WhatsApp, and CRM workflows that surface alerts, lead signals, summaries, and next actions.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Custom internal AI tools',
        description:
          'Focused tools for retrieval, support, operations, drafting, and decision support using real business context.',
      },
    },
  ],
};

export const breadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
