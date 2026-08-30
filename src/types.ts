export type PageRoute = 
  | 'home'
  | 'about'
  | 'features'
  | 'premium'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'refund'
  | 'disclaimer'
  | 'download';

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
