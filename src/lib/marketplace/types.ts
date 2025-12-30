// Marketplace Seller Management Module (Placeholder)
// TODO: Implement when enabling multi-seller functionality

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  taxId?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  commissionRate: number; // Percentage
  isActive: boolean;
  createdAt: Date;
}

export interface SellerOnboarding {
  sellerId: string;
  documents: {
    businessLicense?: string;
    taxCertificate?: string;
    bankDetails?: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface SellerPayout {
  id: string;
  sellerId: string;
  amount: number;
  period: {
    from: Date;
    to: Date;
  };
  status: 'pending' | 'processing' | 'completed';
  processedAt?: Date;
}
