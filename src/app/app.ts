import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Participants } from './components/participants/participants';
import { ExpenseForm } from './components/expense-form/expense-form';
import { SettleUp } from './components/settle-up/settle-up';
import { ExpenseHistory } from './components/expense-history/expense-history';
import { GitHubIntegration } from './components/github-integration/github-integration';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    Participants,
    ExpenseForm,
    SettleUp,
    ExpenseHistory,
    GitHubIntegration
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Expense Splitter';
}
