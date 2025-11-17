import { Injectable, computed, signal } from '@angular/core';
import { Expense, Participant, Settlement } from '../models/expense.models';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly STORAGE_KEY = 'expense-splitter-data';

  // Signals for state management
  participants = signal<Participant[]>([]);
  expenses = signal<Expense[]>([]);

  // Computed signals for calculations
  totalExpenses = computed(() => 
    this.expenses()
      .filter(expense => !expense.isSettlement)
      .reduce((sum, expense) => sum + expense.amount, 0)
  );

  participantsWithBalances = computed(() => {
    const expenses = this.expenses();
    const participants = this.participants();
    
    return participants.map(participant => {
      let totalPaid = 0;
      let totalOwed = 0;

      // Only include expenses that haven't been settled
      expenses.forEach(expense => {
        if (!expense.isSettled && !expense.isSettlement) {
          if (expense.paidBy === participant.id) {
            totalPaid += expense.amount;
          }
          if (expense.splitAmong.includes(participant.id)) {
            totalOwed += expense.amount / expense.splitAmong.length;
          }
        }
      });

      const balance = totalPaid - totalOwed;

      return {
        ...participant,
        totalPaid,
        totalOwed,
        balance
      };
    });
  });

  settlements = computed((): Settlement[] => {
    const balances = this.participantsWithBalances();
    const creditors = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
    
    const settlements: Settlement[] = [];
    let i = 0, j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

      if (amount > 0.01) { // Avoid tiny amounts due to floating point precision
        settlements.push({
          fromParticipant: debtor.id,
          toParticipant: creditor.id,
          amount: Math.round(amount * 100) / 100
        });
      }

      creditor.balance -= amount;
      debtor.balance += amount;

      if (creditor.balance <= 0.01) i++;
      if (debtor.balance >= -0.01) j++;
    }

    return settlements;
  });

  constructor() {
    this.loadFromStorage();
  }

  // Participant management
  addParticipant(name: string): void {
    const newParticipant: Participant = {
      id: this.generateId(),
      name,
      totalPaid: 0,
      totalOwed: 0,
      balance: 0
    };
    
    this.participants.update(participants => [...participants, newParticipant]);
    this.saveToStorage();
  }

  removeParticipant(id: string): void {
    this.participants.update(participants => 
      participants.filter(p => p.id !== id)
    );
    
    // Remove participant from all expenses
    this.expenses.update(expenses =>
      expenses
        .filter(expense => expense.paidBy !== id)
        .map(expense => ({
          ...expense,
          splitAmong: expense.splitAmong.filter(participantId => participantId !== id)
        }))
        .filter(expense => expense.splitAmong.length > 0)
    );
    
    this.saveToStorage();
  }

  // Expense management
  addExpense(description: string, amount: number, paidBy: string, splitAmong: string[]): void {
    const newExpense: Expense = {
      id: this.generateId(),
      description,
      amount,
      paidBy,
      splitAmong,
      date: new Date()
    };

    this.expenses.update(expenses => [...expenses, newExpense]);
    this.saveToStorage();
  }

  removeExpense(id: string): void {
    this.expenses.update(expenses => 
      expenses.filter(e => e.id !== id)
    );
    this.saveToStorage();
  }

  updateExpense(id: string, updates: Partial<Expense>): void {
    this.expenses.update(expenses =>
      expenses.map(expense =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
    this.saveToStorage();
  }

  // Settlement methods
  settleUp(): void {
    const currentSettlements = this.settlements();
    
    if (currentSettlements.length === 0) {
      return; // Nothing to settle
    }

    // Generate a unique settlement ID
    const settlementId = this.generateId();

    // Create a settlement record for history
    const settlementDescription = `Settlement: ${currentSettlements.length} payment(s)`;
    const settlementExpense: Expense = {
      id: settlementId,
      description: settlementDescription,
      amount: 0,
      paidBy: '', // Not applicable for settlements
      splitAmong: [], // Not applicable for settlements
      date: new Date(),
      isSettlement: true,
      settlementDetails: [...currentSettlements]
    };

    // Mark all existing non-settled expenses as settled
    // This keeps them in history but excludes them from balance calculations
    this.expenses.update(expenses => 
      expenses.map(expense => 
        !expense.isSettlement && !expense.isSettled
          ? { ...expense, isSettled: true, settlementId }
          : expense
      )
    );

    // Add the settlement record to expenses history
    this.expenses.update(expenses => [...expenses, settlementExpense]);

    this.saveToStorage();
  }

  // Utility methods
  getParticipantName(id: string): string {
    return this.participants().find(p => p.id === id)?.name || 'Unknown';
  }

  clearAllData(): void {
    this.participants.set([]);
    this.expenses.set([]);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const data = {
        participants: this.participants(),
        expenses: this.expenses()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  }

  private loadFromStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          this.participants.set(parsed.participants || []);
          this.expenses.set(parsed.expenses || []);
        }
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
    }
  }
}