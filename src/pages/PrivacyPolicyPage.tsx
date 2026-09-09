import React from 'react';
import { PageRoute } from '../types';
import { WebsitePrivacyPage } from './WebsitePrivacyPage';

interface PrivacyPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return <WebsitePrivacyPage onNavigate={onNavigate} />;
};
