export type PageRoute = 
  | 'home' 
  | 'articles' 
  | 'article-detail' 
  | 'tools' 
  | 'founder' 
  | 'about' 
  | 'contact' 
  | 'privacy' 
  | 'terms' 
  | 'refund' 
  | 'disclaimer' 
  | 'app-privacy' 
  | 'app-delete' 
  | 'app-delete-account'
  | 'download' 
  | 'premium' 
  | 'careers' 
  | 'author' 
  | 'features' 
  | 'admin';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export type ArticleCategory =
  | 'Digital Safety'
  | 'Cyber Defense'
  | 'Cyber Law'
  | 'Legal Awareness'
  | 'Banking Law'
  | 'Consumer Protection'
  | 'Statutory Rights'
  | 'App Guides'
  | 'Privacy & Tools'
  | string;

export interface ArticleAuthor {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio: string;
  slug: string;
  email?: string;
}

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  readingTime?: string;
  featuredImage?: string;
  tags?: string[];
  isFeatured?: boolean;
  status?: ArticleStatus;
  isPublished?: boolean;
  authorId?: string;
  authorName?: string;
  authorRole?: string;
  authorImage?: string;
  authorBio?: string;
  authorSlug?: string;
  viewCount?: number;
  uniqueViewCount?: number;
  usefulYesCount?: number;
  usefulNoCount?: number;
}

export interface Article extends ArticleSummary {
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  updatedBy?: string;
}

export type ToolCategory =
  | 'pdf'
  | 'image'
  | 'text'
  | 'calculators'
  | 'qr-digital'
  | 'productivity'
  | 'legal'
  | 'calc'
  | 'security'
  | 'privacy'
  | 'utility'
  | 'all';

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  category: ToolCategory;
  categoryLabel?: string;
  categoryLabelHi?: string;
  description: string;
  descriptionHi?: string;
  tags: string[];
  isNew?: boolean;
  isPopular?: boolean;
  iconName?: string;
  privacyNote?: string;
  privacyMode?: string;
  seoTitle?: string;
  seoDescription?: string;
  faq?: ToolFaqItem[];
  relatedSlugs?: string[];
  cta?: string;
}

export interface DigitalProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  format: string;
  fileSize: string;
  price: number;
  priceFormatted: string;
  isPopular?: boolean;
  features: string[];
  sampleItems: string[];
  downloadUrl?: string;
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

export interface ProfessionalListing {
  id: string;
  name: string;
  category: string;
  title: string;
  serviceArea: string;
  experienceYears: number;
  description: string;
  isVerified: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  skills: string[];
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  status: 'active' | 'pending' | 'inactive';
}

export interface ActivatedMembership {
  planId: string;
  planCode: string;
  planName?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  userEmail?: string;
  userId?: string;
  userPhone?: string;
  paymentMethod?: string;
  activatedAt: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  firestoreDocId?: string;
}

export interface RazorpayOrderResponse {
  ok: boolean;
  order_id: string;
  key_id: string;
  amount: number;
  currency: string;
  plan_id?: string;
  plan_name?: string;
  error?: string;
}

export interface RazorpayVerificationResponse {
  ok: boolean;
  verified: boolean;
  membership?: ActivatedMembership;
  error?: string;
}
