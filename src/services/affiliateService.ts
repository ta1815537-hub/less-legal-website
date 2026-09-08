/**
 * AFFILIATE & RECOMMENDED RESOURCES ARCHITECTURE — LESS CREATION
 * Modular, transparent recommendations with clear disclosure.
 */

import { AffiliateResource } from '../types';

export const AFFILIATE_RESOURCES: AffiliateResource[] = [
  {
    id: 'res-cloudflare',
    title: 'Cloudflare Zero Trust & CDN',
    category: 'Hosting & Security',
    description: 'Ultra-fast edge network, SSL protection, and DDoS mitigation for modern websites and APIs.',
    benefit: 'Free tier with global edge routing',
    url: 'https://www.cloudflare.com',
    badge: 'Recommended Infrastructure',
    disclosure: 'We personally use Cloudflare to deliver Less Creation fast and securely to users worldwide.'
  },
  {
    id: 'res-razorpay',
    title: 'Razorpay Payment Gateway',
    category: 'Payments',
    description: 'Trusted Indian payment infrastructure supporting UPI, Cards, NetBanking, and Instant Refunds.',
    benefit: 'Industry standard for digital businesses in India',
    url: 'https://razorpay.com',
    badge: 'Verified Payment Partner',
    disclosure: 'Official payment processor integrated with Less Creation.'
  },
  {
    id: 'res-ecourts',
    title: 'eCourts Services India',
    category: 'Government Portal',
    description: 'Official National Judicial Data Grid (NJDG) portal to view case status, cause lists, and daily court orders across District and High Courts.',
    benefit: 'Official Public Service by NIC',
    url: 'https://ecourts.gov.in',
    badge: 'Public Utility',
    disclosure: 'Independent link to official Government portal.'
  }
];

export const affiliateService = {
  getResources(): AffiliateResource[] {
    return AFFILIATE_RESOURCES;
  }
};
