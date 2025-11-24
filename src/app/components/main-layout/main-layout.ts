import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Participants } from '../participants/participants';
import { ExpenseForm } from '../expense-form/expense-form';
import { SettleUp } from '../settle-up/settle-up';
import { ExpenseHistory } from '../expense-history/expense-history';
import { GitHubIntegration } from '../github-integration/github-integration';

@Component({
  selector: 'app-main-layout',
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
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  title = 'Expense Splitter';
}
