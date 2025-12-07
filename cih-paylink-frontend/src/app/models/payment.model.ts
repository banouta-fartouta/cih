export interface Payment {
  id: string;
  merchantId: string;
  amount: number;
  amountMAD: number;
  currency: string;
  status: string;
  customerEmail?: string;
  cardLast4?: string;
  createdAt: string;
  completedAt?: string;
}