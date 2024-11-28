export interface Bank {
  id: string;
  name: string;
  connectionMethod: string;
  logoUrl?: string;
  domain: string;
  ssoEnabled: boolean;
}

export interface SubAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankId: string;
  bankName: string;
  bankLogo?: string;
  lastSync: string;
  status: 'active' | 'error' | 'disconnected';
  subAccounts: SubAccount[];
  connectionType: 'credentials' | 'sso';
}