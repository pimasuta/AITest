import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss',
})
export class ExpenseForm {
  expenseService = inject(ExpenseService);
  
  description = signal('');
  amount = signal<number | null>(null);
  paidBy = signal('');
  selectedParticipants = signal<{[key: string]: boolean}>({});

  canAddExpense = computed(() => {
    const selectedCount = Object.values(this.selectedParticipants()).filter(Boolean).length;
    return this.description().trim() && 
           this.amount() && 
           this.amount()! > 0 && 
           this.paidBy() && 
           selectedCount > 0;
  });

  addExpense(): void {
    if (!this.canAddExpense()) return;

    const splitAmong = Object.entries(this.selectedParticipants())
      .filter(([_, selected]) => selected)
      .map(([participantId]) => participantId);

    this.expenseService.addExpense(
      this.description(),
      this.amount()!,
      this.paidBy(),
      splitAmong
    );

    this.resetForm();
  }

  onParticipantToggle(participantId: string, checked: boolean): void {
    this.selectedParticipants.update(selections => ({
      ...selections,
      [participantId]: checked
    }));
  }

  selectAllParticipants(): void {
    const allSelected: {[key: string]: boolean} = {};
    this.expenseService.participants().forEach(p => {
      allSelected[p.id] = true;
    });
    this.selectedParticipants.set(allSelected);
  }

  private resetForm(): void {
    this.description.set('');
    this.amount.set(null);
    this.paidBy.set('');
    this.selectedParticipants.set({});
  }
}
