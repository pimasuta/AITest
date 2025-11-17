import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExpenseService } from '../../services/expense.service';
import { SettleUpDialogComponent } from '../settle-up-dialog/settle-up-dialog';

@Component({
  selector: 'app-settle-up',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './settle-up.html',
  styleUrl: './settle-up.scss',
})
export class SettleUp {
  expenseService = inject(ExpenseService);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  getParticipantName(id: string): string {
    return this.expenseService.getParticipantName(id);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  settleUp(): void {
    const settlements = this.expenseService.settlements();
    
    if (settlements.length === 0) {
      this.snackBar.open('Nothing to settle! Everyone is already even.', 'Close', {
        duration: 3000
      });
      return;
    }

    // Open confirmation dialog
    const dialogRef = this.dialog.open(SettleUpDialogComponent, {
      width: '500px',
      data: { settlements }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.expenseService.settleUp();
        this.snackBar.open('Successfully settled up! Check the History tab to see the transactions.', 'Close', {
          duration: 5000
        });
      }
    });
  }
}
