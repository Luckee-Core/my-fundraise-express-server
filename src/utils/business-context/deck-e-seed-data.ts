/** Deck E default section definitions for business context seed. */
export type DeckESeedSection = {
  sectionKey: string;
  label: string;
  description: string;
  sortOrder: number;
};

/** Deck E default atomic facts for business context seed. */
export type DeckESeedFact = {
  sectionKey: string;
  factKey: string;
  factValue: string;
  sortOrder: number;
};

export const DECK_E_SEED_SECTIONS: DeckESeedSection[] = [
  {
    sectionKey: 'identity',
    label: 'Identity',
    description: 'Company name, tagline, kicker, website, one-liner',
    sortOrder: 0,
  },
  {
    sectionKey: 'icp',
    label: 'ICP',
    description: 'Who you sell to — businesses segment, household income band',
    sortOrder: 1,
  },
  {
    sectionKey: 'problem',
    label: 'Problem',
    description: 'Market gaps — vendor-owned memory, GPU overkill, fragmented tools',
    sortOrder: 2,
  },
  {
    sectionKey: 'product',
    label: 'Product',
    description: 'Module menu concept, on-prem install, Pro Cloud',
    sortOrder: 3,
  },
  {
    sectionKey: 'wedge',
    label: 'Wedge',
    description: 'AIP process, NBA process, less-GPU rationale',
    sortOrder: 4,
  },
  {
    sectionKey: 'business_model',
    label: 'Business Model',
    description: 'Revenue streams — one fact per stream',
    sortOrder: 5,
  },
  {
    sectionKey: 'competition',
    label: 'Competition',
    description: 'One fact per competitor category',
    sortOrder: 6,
  },
  {
    sectionKey: 'founder',
    label: 'Founder',
    description: 'Matt experience — one fact per role',
    sortOrder: 7,
  },
  {
    sectionKey: 'traction',
    label: 'Traction',
    description: 'Current product state — one fact per claim',
    sortOrder: 8,
  },
  {
    sectionKey: 'fundraising',
    label: 'Fundraising',
    description: 'Ask amount, timeline, use of funds',
    sortOrder: 9,
  },
  {
    sectionKey: 'constraints',
    label: 'Constraints',
    description: 'What not to say in Deck E narrative',
    sortOrder: 10,
  },
];

export const DECK_E_SEED_FACTS: DeckESeedFact[] = [
  { sectionKey: 'identity', factKey: 'company_name', factValue: 'Luckee', sortOrder: 0 },
  {
    sectionKey: 'identity',
    factKey: 'tagline',
    factValue: 'Your data. Your workflows. Your brain.',
    sortOrder: 1,
  },
  {
    sectionKey: 'identity',
    factKey: 'kicker',
    factValue: 'On-premise AI infrastructure',
    sortOrder: 2,
  },
  {
    sectionKey: 'identity',
    factKey: 'one_liner',
    factValue:
      'Premier on-prem AI for everyday businesses and households — pick your modules, Luckee installs.',
    sortOrder: 3,
  },
  { sectionKey: 'identity', factKey: 'website', factValue: 'luckeeapp.com', sortOrder: 4 },
  {
    sectionKey: 'icp',
    factKey: 'icp_businesses',
    factValue: 'Small businesses in America — local service shops below the ServiceTitan tier.',
    sortOrder: 0,
  },
  {
    sectionKey: 'icp',
    factKey: 'icp_households',
    factValue: 'Households earning $200k–$1M per year who want home AI without cloud lock-in.',
    sortOrder: 1,
  },
  {
    sectionKey: 'problem',
    factKey: 'problem_vendor_memory',
    factValue: 'Cloud AI means prompts, context, and outcomes live on someone else\'s machine.',
    sortOrder: 0,
  },
  {
    sectionKey: 'problem',
    factKey: 'problem_gpu_overkill',
    factValue:
      'On-prem alternatives size hardware for larger GPUs and always-on agents — overkill for most workflows.',
    sortOrder: 1,
  },
  {
    sectionKey: 'problem',
    factKey: 'problem_fragmented_tools',
    factValue: 'Business ops and personal life still run across disconnected tools.',
    sortOrder: 2,
  },
  {
    sectionKey: 'product',
    factKey: 'product_module_menu',
    factValue:
      'Customers pick modules for business scenarios (leads, ops, fundraise) or family scenarios (health, finances, knowledge).',
    sortOrder: 0,
  },
  {
    sectionKey: 'product',
    factKey: 'product_on_prem',
    factValue: 'Luckee installs selected modules on hardware the customer owns on their LAN.',
    sortOrder: 1,
  },
  {
    sectionKey: 'product',
    factKey: 'product_pro_cloud',
    factValue: 'Same module menu hosted by Luckee for buyers who do not want to own the box.',
    sortOrder: 2,
  },
  {
    sectionKey: 'wedge',
    factKey: 'wedge_aip',
    factValue:
      'AI Processes run scheduled, bounded jobs — digests, categorization, research queues — not 24/7 chat bots.',
    sortOrder: 0,
  },
  {
    sectionKey: 'wedge',
    factKey: 'wedge_nba',
    factValue:
      'Next Best Actions: operator defines the action menu; AI ranks options; human approves before anything ships.',
    sortOrder: 1,
  },
  {
    sectionKey: 'wedge',
    factKey: 'wedge_less_gpu',
    factValue:
      'Short exchanges and fact-backed Postgres memory mean less GPU than agent-hub appliances sized for inference duty cycle.',
    sortOrder: 2,
  },
  {
    sectionKey: 'business_model',
    factKey: 'revenue_stream_install',
    factValue: 'Installation + maintenance — hardware, modules on LAN, ongoing support contract.',
    sortOrder: 0,
  },
  {
    sectionKey: 'business_model',
    factKey: 'revenue_stream_pro_cloud',
    factValue: 'Pro Cloud — same modules, Luckee-hosted.',
    sortOrder: 1,
  },
  {
    sectionKey: 'competition',
    factKey: 'comp_cloud_saas',
    factValue: 'Cloud AI and Big SaaS — vendor owns your memory; integration sprawl.',
    sortOrder: 0,
  },
  {
    sectionKey: 'competition',
    factKey: 'comp_on_prem_peers',
    factValue:
      'Other on-prem AI models (DevXT, etc.) — focus on larger GPUs, always-on agents, open-ended chat.',
    sortOrder: 1,
  },
  {
    sectionKey: 'competition',
    factKey: 'comp_luckee_contrast',
    factValue:
      'Luckee — module menu, AIP/NBA process, less GPU, operator-approved actions; Luckee installs and maintains.',
    sortOrder: 2,
  },
  {
    sectionKey: 'founder',
    factKey: 'founder_revature',
    factValue:
      'Salesforce trainer and developer at Revature — taught technical concepts at scale to non-technical cohorts.',
    sortOrder: 0,
  },
  {
    sectionKey: 'founder',
    factKey: 'founder_agency',
    factValue:
      'Six years as software agency owner, still hands-on — scoping, shipping, integrations under deadline.',
    sortOrder: 1,
  },
  {
    sectionKey: 'founder',
    factKey: 'founder_gallen',
    factValue:
      'Gallen Restoration electrical crew supervisor through 2018 — field and trades reality before full-time software.',
    sortOrder: 2,
  },
  {
    sectionKey: 'traction',
    factKey: 'traction_hub_studios',
    factValue: '15 studios registered in Luckee Dev Hub; getting-started map documents self-host path.',
    sortOrder: 0,
  },
  {
    sectionKey: 'traction',
    factKey: 'traction_pre_revenue',
    factValue: 'Pre-revenue; install economics modeled (~$3,360 platform anchor); founder-led Philly pipeline.',
    sortOrder: 1,
  },
  {
    sectionKey: 'fundraising',
    factKey: 'ask_amount',
    factValue: '$500K',
    sortOrder: 0,
  },
  {
    sectionKey: 'fundraising',
    factKey: 'ask_timeline',
    factValue: '12 months',
    sortOrder: 1,
  },
  {
    sectionKey: 'fundraising',
    factKey: 'ask_use_of_funds',
    factValue:
      'Marketing and sales automation; coding tokens and software subscriptions; field install with one lead technician (electrician and carpenter), service truck, ethernet runs, and device storage.',
    sortOrder: 2,
  },
  {
    sectionKey: 'constraints',
    factKey: 'exclude_installer_network',
    factValue: 'Do not mention Installer Network or Trusted Partners — Matt/Luckee is the installer.',
    sortOrder: 0,
  },
  {
    sectionKey: 'constraints',
    factKey: 'exclude_certs',
    factValue: 'Do not mention certifications, Blueprints, or 1M jobs narrative in Deck E.',
    sortOrder: 1,
  },
];

/** Section keys loaded for graphics generation prompts. */
export const GRAPHICS_BUSINESS_CONTEXT_SECTION_KEYS = ['identity', 'product'] as const;

/** Section keys loaded for pitch copy / guidance prompts. */
export const PITCH_COPY_BUSINESS_CONTEXT_SECTION_KEYS = [
  'identity',
  'icp',
  'problem',
  'wedge',
  'constraints',
] as const;
