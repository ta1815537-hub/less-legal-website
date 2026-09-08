export type PageRoute = 
  | 'home'
  | 'about'
  | 'founder'
  | 'careers'
  | 'features'
  | 'less-legal'
  | 'less-legal-features'
  | 'resources'
  | 'premium'
  | 'contact'
  | 'privacy'
  | 'app-privacy'
  | 'app-delete-account'
  | 'terms'
  | 'refund'
  | 'disclaimer'
  | 'download'
  | 'admin'
  | 'tools'
  | 'professionals'
  | 'templates'
  | 'pricing'
  | 'articles'
  | 'article-detail'
  | 'author-detail';

export interface ArticleAuthor {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio: string;
  slug: string;
}

export type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorRole: string;
  authorImage?: string;
  authorBio?: string;
  authorSlug: string;
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  viewCount?: number;
  uniqueViewCount?: number;
  createdAt: string;
  createdBy?: string;
  updatedBy?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  usefulYesCount?: number;
  usefulNoCount?: number;
  firestoreDocId?: string;
}

export type ArticleSummary = Omit<Article, 'content'>;

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
}

export interface NavItem {
  label: string;
  route: PageRoute;
  path: string;
  isPrimary?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Premium & Billing' | 'Utilities & Privacy' | 'Verification';
}

export interface ActivatedMembership {
  id?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REFUNDED';
  planId: string;
  planCode: string;
  planName: string;
  amount: number;
  amountFormatted: string;
  currency: string;
  validityDays: number;
  startDate: string;
  expiryDate: string;
  userId?: string;
  userEmail?: string;
  userContact?: string;
  paymentMethod?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  verifiedAt: string;
  firestoreDocId?: string;
}

export interface RazorpayOrderResponse {
  ok: boolean;
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  plan_id: string;
  plan_code: string;
  plan_name: string;
  validity_days: number;
  receipt: string;
  error?: string;
}

export interface RazorpayVerificationResponse {
  ok: boolean;
  verified: boolean;
  membership?: ActivatedMembership;
  message?: string;
  error?: string;
}

// --- NEW ADDITIVE UTILITY ECOSYSTEM TYPES ---

export type ToolCategory = 
  | 'pdf'
  | 'image'
  | 'text'
  | 'calculators'
  | 'qr-digital'
  | 'productivity'
  | 'legal';

export interface ToolDefinition {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  category: ToolCategory;
  categoryLabel: string;
  categoryLabelHi?: string;
  description: string;
  descriptionHi?: string;
  iconName: string;
  isPopular?: boolean;
  isNew?: boolean;
  isPro?: boolean;
  tags: string[];
  privacyNote?: string;
  seoTitle: string;
  seoDescription: string;
  faq?: { question: string; answer: string }[];
  relatedSlugs?: string[];
  // Extended fields for Discovery Upgrade
  synonyms?: string[];
  intentPhrases?: string[];
  cta?: string;
  isFree?: boolean;
  isPremium?: boolean;
  privacyMode?: 'on-device' | 'server-side' | 'hybrid';
}

export interface ProfessionalListing {
  id: string;
  name: string;
  category: 'Advocate' | 'Chartered Accountant' | 'Consultant' | 'Designer' | 'Developer' | 'Freelancer' | 'Documentation Pro' | 'Other';
  title: string;
  serviceArea: string;
  experienceYears: number;
  description: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  skills: string[];
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  linkedin?: string;
  status: 'active' | 'pending' | 'expired';
}

export interface DigitalProduct {
  id: string;
  title: string;
  category: 'Legal Drafts' | 'Business Templates' | 'Productivity Packs' | 'Checklists' | 'Printables';
  description: string;
  format: string; // e.g., 'PDF + DOCX'
  fileSize?: string;
  price: number; // 0 for free
  priceFormatted: string;
  isPopular?: boolean;
  features: string[];
  sampleItems?: string[];
  downloadUrl?: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  organization: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Freelance';
  location: string;
  stipendOrSalary: string;
  description: string;
  requirements: string[];
  deadline: string;
  applyEmailOrLink: string;
  isFeatured?: boolean;
  status: 'active' | 'closed';
}

export interface AffiliateResource {
  id: string;
  title: string;
  category: string;
  description: string;
  benefit: string;
  url: string;
  badge?: string;
  disclosure: string;
}

