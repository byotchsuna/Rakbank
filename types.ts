export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  type: 'in' | 'out';
  category?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  creditScore: number;
  balance: number;
  transactions: Transaction[];
}