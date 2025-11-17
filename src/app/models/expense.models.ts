export interface Participant {
  id: string;
  name: string;
  email?: string;
  totalPaid: number;
  totalOwed: number;
  balance: number; // positive means they are owed, negative means they owe
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // participant id
  splitAmong: string[]; // array of participant ids
  date: Date;
  category?: string;
  isSettlement?: boolean; // marks if this is a settlement transaction
  settlementDetails?: Settlement[]; // stores the settlement transactions
  isSettled?: boolean; // marks if this expense was part of a completed settlement
  settlementId?: string; // links expense to the settlement that cleared it
}

export interface Settlement {
  fromParticipant: string; // participant id who owes
  toParticipant: string; // participant id who is owed
  amount: number;
}

export interface PaymentRecord {
  id: string;
  fromParticipant: string;
  toParticipant: string;
  amount: number;
  date: Date;
  settled: boolean;
}