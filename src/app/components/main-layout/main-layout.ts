import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MsalService } from '@azure/msal-angular';
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
    MatMenuModule,
    Participants,
    ExpenseForm,
    SettleUp,
    ExpenseHistory,
    GitHubIntegration
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  private authService = inject(MsalService);
  private router = inject(Router);
  
  title = 'Expense Splitter';
  userName = '';
  userEmail = '';

  async ngOnInit(): Promise<void> {
    // Wait for MSAL to initialize
    await this.authService.instance.initialize();
    
    const account = this.authService.instance.getActiveAccount();
    if (!account) {
      // No authenticated account, redirect to login
      this.router.navigate(['/login']);
      return;
    }
    
    this.userName = account.name || account.username;
    this.userEmail = account.username; // username typically contains the email
  }

  logout(): void {
    this.authService.logoutRedirect();
  }
}
