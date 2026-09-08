/**
 * DIGITAL PRODUCTS & TEMPLATES SERVICE — LESS CREATION
 * Curated, ready-to-use downloadable packs and legal/business templates.
 */

import { DigitalProduct } from '../types';

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'pack-legal-drafts',
    title: 'Essential Legal Drafting & Agreement Pack',
    category: 'Legal Drafts',
    description: '45+ professionally formatted Word/PDF agreements including NDAs, Residential Rent Agreements, Freelance Service Contracts, and Legal Notices.',
    format: 'DOCX + PDF Bundle',
    fileSize: '4.8 MB',
    price: 0, // Free for community
    priceFormatted: 'Free',
    isPopular: true,
    features: [
      'Editable Word (.docx) & printable PDF versions',
      'Clause-by-clause commentary & guidance',
      'Compliant with Indian Contract Act 1872',
      'Standard boilerplate clauses included'
    ],
    sampleItems: [
      'Mutual Non-Disclosure Agreement (NDA)',
      'Standard Residential Tenancy Agreement',
      'Independent Contractor / Freelancer Agreement',
      'Demand Notice for Recovery of Dues (Section 138 NI Act sample)'
    ]
  },
  {
    id: 'pack-business-startup',
    title: 'Startup & MSME Compliance Checklist Pack',
    category: 'Business Templates',
    description: 'Comprehensive annual compliance schedules, board resolution templates, and invoice formats designed for Indian small businesses.',
    format: 'XLSX + PDF',
    fileSize: '2.1 MB',
    price: 0,
    priceFormatted: 'Free',
    isPopular: true,
    features: [
      'GST and TDS monthly & quarterly timelines',
      'Standard GST Tax Invoice template',
      'Vendor Onboarding Verification Checklist',
      'Shareholder & Director Resolution drafts'
    ],
    sampleItems: [
      'Annual Statutory Filing Tracker 2025-26',
      'GST Compliant B2B Invoice Sheet',
      'Director Board Resolution for Bank Account Opening',
      'Employee NDA & Offer Letter Template'
    ]
  },
  {
    id: 'pack-advocate-diary',
    title: 'Advocate Chamber & Case Diary Printable Kit',
    category: 'Productivity Packs',
    description: 'Specially formatted courtroom worksheets, limitation calendar, daily cause list organizers, and client briefing intake sheets.',
    format: 'Print-Ready PDF (A4 & Legal)',
    fileSize: '3.4 MB',
    price: 0,
    priceFormatted: 'Free',
    isPopular: false,
    features: [
      'Optimized for both A4 and Legal paper sizes',
      'Hearing stage notes & adjournment record fields',
      'Quick limitation period cheat sheet',
      'Minimalist, high-contrast ink-saving design'
    ],
    sampleItems: [
      'Daily Court Cause List Work Sheet',
      'Client Case Brief & Retainer Record',
      'Witness Examination Note Sheet',
      'Limitation Period Quick Reference Chart'
    ]
  },
  {
    id: 'pack-citizen-rights',
    title: 'Citizen Rights & Police Interaction Handbook',
    category: 'Checklists',
    description: 'A pocket-guide to your rights during traffic stops, FIR registration, arrest guidelines (D.K. Basu guidelines), and consumer grievances.',
    format: 'PDF (Digital + Mobile-friendly)',
    fileSize: '1.6 MB',
    price: 0,
    priceFormatted: 'Free',
    isPopular: true,
    features: [
      'Plain-language explanation without legalese',
      'Available in English & Hindi summary',
      'Direct emergency helpline numbers',
      'Zero lawyer jargon — practical steps'
    ],
    sampleItems: [
      'Arrest Safeguards (Section 41A CrPC / BNSS)',
      'What to do if Police Refuse to File an FIR',
      'Consumer Forum Filing Steps (E-Daakhil Guide)',
      'Motor Vehicle Act Fine & Towing Rules'
    ]
  }
];

export const digitalProductsService = {
  getProducts(): DigitalProduct[] {
    return DIGITAL_PRODUCTS;
  }
};
