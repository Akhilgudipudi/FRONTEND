import React, { createContext, useContext, useState, useEffect } from 'react';
import { Certification, CertificationStatus } from '../types';
import { differenceInDays, parseISO } from 'date-fns';

interface CertificationContextType {
  certifications: Certification[];
  addCertification: (cert: Omit<Certification, 'id' | 'status'>) => void;
  updateCertification: (id: string, cert: Omit<Certification, 'id' | 'status'>) => void;
  deleteCertification: (id: string) => void;
  getCertificationById: (id: string) => Certification | undefined;
}

const CertificationContext = createContext<CertificationContextType | undefined>(undefined);

const calculateStatus = (expiryDate: string): CertificationStatus => {
  const daysUntilExpiry = differenceInDays(parseISO(expiryDate), new Date());
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring-soon';
  return 'active';
};

const mockCertifications: Omit<Certification, 'status'>[] = [
  {
    id: '1',
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    category: 'Technology',
    issueDate: '2023-06-15',
    expiryDate: '2026-06-15',
    credentialId: 'AWS-CSA-2023-5892',
    description: 'Professional level cloud architecture certification'
  },
  {
    id: '2',
    name: 'Project Management Professional (PMP)',
    issuer: 'Project Management Institute',
    category: 'Business',
    issueDate: '2024-01-20',
    expiryDate: '2027-01-20',
    credentialId: 'PMP-8472819',
    description: 'Industry-recognized project management certification'
  },
  {
    id: '3',
    name: 'Certified Information Systems Security Professional',
    issuer: 'ISC²',
    category: 'Technology',
    issueDate: '2022-09-10',
    expiryDate: '2025-09-10',
    credentialId: 'CISSP-928471',
    description: 'Advanced cybersecurity certification'
  },
  {
    id: '4',
    name: 'First Aid & CPR',
    issuer: 'Red Cross',
    category: 'Health & Safety',
    issueDate: '2024-11-05',
    expiryDate: '2026-11-05',
    credentialId: 'RC-FA-2024-3847',
    description: 'Emergency response certification'
  },
  {
    id: '5',
    name: 'Google Analytics Certification',
    issuer: 'Google',
    category: 'Marketing',
    issueDate: '2024-08-12',
    expiryDate: '2025-08-12',
    credentialId: 'GA-CERT-8472',
    description: 'Digital analytics and data interpretation'
  },
  {
    id: '6',
    name: 'Certified Scrum Master',
    issuer: 'Scrum Alliance',
    category: 'Business',
    issueDate: '2023-03-22',
    expiryDate: '2025-03-22',
    credentialId: 'CSM-2847291',
    description: 'Agile project management methodology'
  }
];

export function CertificationProvider({ children }: { children: React.ReactNode }) {
  const [certifications, setCertifications] = useState<Certification[]>(() => {
    // Load from localStorage or use mock data
    const stored = localStorage.getItem('certifications');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((cert: Omit<Certification, 'status'>) => ({
        ...cert,
        status: calculateStatus(cert.expiryDate)
      }));
    }
    return mockCertifications.map(cert => ({
      ...cert,
      status: calculateStatus(cert.expiryDate)
    }));
  });

  useEffect(() => {
    // Save to localStorage whenever certifications change
    localStorage.setItem('certifications', JSON.stringify(certifications));
  }, [certifications]);

  const addCertification = (cert: Omit<Certification, 'id' | 'status'>) => {
    const newCert: Certification = {
      ...cert,
      id: Date.now().toString(),
      status: calculateStatus(cert.expiryDate)
    };
    setCertifications(prev => [...prev, newCert]);
  };

  const updateCertification = (id: string, cert: Omit<Certification, 'id' | 'status'>) => {
    setCertifications(prev => 
      prev.map(c => c.id === id ? {
        ...cert,
        id,
        status: calculateStatus(cert.expiryDate)
      } : c)
    );
  };

  const deleteCertification = (id: string) => {
    setCertifications(prev => prev.filter(c => c.id !== id));
  };

  const getCertificationById = (id: string) => {
    return certifications.find(c => c.id === id);
  };

  return (
    <CertificationContext.Provider
      value={{
        certifications,
        addCertification,
        updateCertification,
        deleteCertification,
        getCertificationById
      }}
    >
      {children}
    </CertificationContext.Provider>
  );
}

export function useCertifications() {
  const context = useContext(CertificationContext);
  if (!context) {
    throw new Error('useCertifications must be used within CertificationProvider');
  }
  return context;
}
