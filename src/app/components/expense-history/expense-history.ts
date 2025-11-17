import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.models';

@Component({
  selector: 'app-expense-history',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './expense-history.html',
  styleUrl: './expense-history.scss',
})
export class ExpenseHistory {
  expenseService = inject(ExpenseService);

  trackByExpenseId(index: number, expense: Expense): string {
    return expense.id;
  }

  getParticipantName(id: string): string {
    return this.expenseService.getParticipantName(id);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateSplitAmount(expense: Expense): number {
    return expense.amount / expense.splitAmong.length;
  }

  removeExpense(expenseId: string): void {
    this.expenseService.removeExpense(expenseId);
  }

  getTotalExpenses(): string {
    return this.formatCurrency(this.expenseService.totalExpenses());
  }
}
