import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-participants',
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './participants.html',
  styleUrl: './participants.scss',
})
export class Participants {
  expenseService = inject(ExpenseService);
  newParticipantName = signal('');

  addParticipant(): void {
    const name = this.newParticipantName().trim();
    if (name) {
      this.expenseService.addParticipant(name);
      this.newParticipantName.set('');
    }
  }

  removeParticipant(id: string): void {
    this.expenseService.removeParticipant(id);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addParticipant();
    }
  }
}
