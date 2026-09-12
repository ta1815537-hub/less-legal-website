/**
 * PROFESSIONAL & BUSINESS LISTING SERVICE — LESS CREATION
 * Enables discovery and connection with verified Advocates, CAs,
 * Consultants, Designers, Developers, and Documentation professionals.
 */

import { ProfessionalListing } from '../types';

export const INITIAL_PROFESSIONALS: ProfessionalListing[] = [
  {
    id: 'pro-adv-01',
    name: 'Adv. Rajesh Verma',
    category: 'Advocate',
    title: 'High Court Civil & Commercial Litigator',
    serviceArea: 'Delhi NCR & Allahabad HC',
    experienceYears: 14,
    description: 'Specializing in civil disputes, consumer protection, property contracts, and high court writ petitions with 14+ years active bar practice.',
    isVerified: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 38,
    skills: ['Civil Law', 'Property Verification', 'High Court Writs', 'Arbitration'],
    contactEmail: 'advocate.rajesh@example.com',
    contactPhone: '+91 98110 23456',
    status: 'active'
  },
  {
    id: 'pro-ca-02',
    name: 'Priya Sharma & Associates',
    category: 'Chartered Accountant',
    title: 'FCA, Corporate Tax & GST Consultant',
    serviceArea: 'Mumbai & Pan-India Remote',
    experienceYears: 10,
    description: 'Providing comprehensive GST filings, company incorporation, trademark advisory, and business audit services for startups and MSMEs.',
    isVerified: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 45,
    skills: ['GST Filing', 'Income Tax Audit', 'Company Formation', 'Financial Advisory'],
    contactEmail: 'priya.ca@example.com',
    contactPhone: '+91 98200 45678',
    status: 'active'
  },
  {
    id: 'pro-dev-03',
    name: 'Vikram Sundaram',
    category: 'Developer',
    title: 'Full Stack Web & Android Engineer',
    serviceArea: 'Bengaluru / Remote',
    experienceYears: 7,
    description: 'Crafting ultra-fast, clean web applications and native Android utilities with modern React, TypeScript, and Kotlin.',
    isVerified: true,
    isFeatured: false,
    rating: 5.0,
    reviewCount: 22,
    skills: ['React & Next.js', 'Android/Kotlin', 'API Integration', 'Cloud Architecture'],
    contactEmail: 'vikram.dev@example.com',
    website: 'https://github.com',
    status: 'active'
  },
  {
    id: 'pro-doc-04',
    name: 'Aman Documentation & Stamp Desk',
    category: 'Documentation Pro',
    title: 'Deed Drafter & Registry Facilitator',
    serviceArea: 'Lucknow & Uttar Pradesh',
    experienceYears: 12,
    description: 'Professional assistance with rent agreements, sale deeds, affidavits, succession certificates, and revenue record verifications.',
    isVerified: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 29,
    skills: ['Rent Agreements', 'Affidavits', 'Sale Deeds', 'Revenue Verification'],
    contactPhone: '+91 94150 78901',
    status: 'active'
  },
  {
    id: 'pro-des-05',
    name: 'Neha Kapoor Studios',
    category: 'Designer',
    title: 'Brand Identity & Product Designer',
    serviceArea: 'Pune / Remote',
    experienceYears: 6,
    description: 'Design systems, typography, clean UI/UX for SaaS and mobile apps. Obsessed with simplicity and readable micro-copy.',
    isVerified: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 19,
    skills: ['UI/UX Design', 'Design Systems', 'Brand Identity', 'Typography'],
    contactEmail: 'neha@designstudio.example',
    status: 'active'
  },
  {
    id: 'pro-con-06',
    name: 'Dr. Sanjay Gupta, Ph.D.',
    category: 'Consultant',
    title: 'IPR & Patent Strategy Advisor',
    serviceArea: 'Hyderabad / Global',
    experienceYears: 16,
    description: 'Guiding tech founders and innovators through patent filing, prior art search, trademark prosecution, and copyright protection.',
    isVerified: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 31,
    skills: ['Patent Filing', 'IP Strategy', 'Prior Art Search', 'Trademark Dispute'],
    contactEmail: 'sanjay.ipr@example.com',
    status: 'active'
  }
];

const LOCAL_STORAGE_LISTINGS_KEY = 'less_creation_custom_listings';

export const listingService = {
  getListings(): ProfessionalListing[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_LISTINGS_KEY);
      if (stored) {
        const custom: ProfessionalListing[] = JSON.parse(stored);
        return [...custom, ...INITIAL_PROFESSIONALS];
      }
    } catch {}
    return INITIAL_PROFESSIONALS;
  },

  addListing(listing: Omit<ProfessionalListing, 'id' | 'status'>): ProfessionalListing {
    const newListing: ProfessionalListing = {
      ...listing,
      id: `pro-custom-${Date.now()}`,
      status: 'active'
    };

    try {
      const existing = this.getListings().filter(p => p.id.startsWith('pro-custom-'));
      localStorage.setItem(LOCAL_STORAGE_LISTINGS_KEY, JSON.stringify([newListing, ...existing]));
    } catch {}

    return newListing;
  }
};
