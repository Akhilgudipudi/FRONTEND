export type CertificationStatus = 'active' | 'expiring-soon' | 'expired';

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  category: string;
  issueDate: string;
  expiryDate: string;
  credentialId?: string;
  description?: string;
  status: CertificationStatus;
}

export type CategoryType = 
  | 'Technology' 
  | 'Business' 
  | 'Health & Safety' 
  | 'Finance' 
  | 'Education' 
  | 'Marketing'
  | 'Other';
