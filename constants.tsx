import { UserProfile } from './types';

export const RAKBANK_MOCK_USER: UserProfile = {
  name: 'ADAM SMITH',
  email: 'adam.smith@example.com',
  creditScore: 785,
  balance: 245850.50,
  transactions: [
    { 
      id: 'tx-001', 
      date: 'Oct 24, 2024', 
      merchant: 'Carrefour Mall of Emirates', 
      amount: 450.25, 
      type: 'out', 
      category: 'Groceries' 
    },
    { 
      id: 'tx-002', 
      date: 'Oct 22, 2024', 
      merchant: 'DEWA Bill Payment', 
      amount: 1200.00, 
      type: 'out', 
      category: 'Utilities' 
    },
    { 
      id: 'tx-003', 
      date: 'Oct 20, 2024', 
      merchant: 'Salary Deposit', 
      amount: 35000.00, 
      type: 'in', 
      category: 'Income' 
    },
    { 
      id: 'tx-004', 
      date: 'Oct 18, 2024', 
      merchant: 'Etisalat Renewal', 
      amount: 399.00, 
      type: 'out', 
      category: 'Bills' 
    }
  ]
};