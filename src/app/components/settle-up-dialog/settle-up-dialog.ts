import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Settlement } from '../../models/expense.models';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-settle-up-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './settle-up-dialog.html',
  styleUrl: './settle-up-dialog.scss',
})
export class SettleUpDialogComponent {
  dialogRef = inject(MatDialogRef<SettleUpDialogComponent>);
  data: { settlements: Settlement[] } = inject(MAT_DIALOG_DATA);
  expenseService = inject(ExpenseService);

  getParticipantName(id: string): string {
    return this.expenseService.getParticipantName(id);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
