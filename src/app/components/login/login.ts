import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { loginRequest } from '../../config/msal.config';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  private authService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);
  router = inject(Router);
  private readonly _destroying$ = new Subject<void>();

  isLoading = false;
  loginError: string | null = null;
  userName: string | null = null;
  userEmail: string | null = null;
  isLoggedIn = false;

  ngOnInit(): void {
    // Check if user is already logged in
    this.checkLoginStatus();

    // Subscribe to MSAL events
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
        this.loadUserProfile();
      });

    // Subscribe to interaction status
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkLoginStatus();
      });
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }

  checkLoginStatus(): void {
    const accounts = this.authService.instance.getAllAccounts();
    if (accounts.length > 0) {
      this.authService.instance.setActiveAccount(accounts[0]);
      this.isLoggedIn = true;
      this.loadUserProfile();
      // Redirect to main app after successful login
      this.router.navigate(['/']);
    }
  }

  loadUserProfile(): void {
    const account = this.authService.instance.getActiveAccount();
    if (account) {
      this.userName = account.name || account.username;
      this.userEmail = account.username; // username typically contains the email
      this.isLoggedIn = true;
    }
  }

  login(): void {
    this.isLoading = true;
    this.loginError = null;

    this.authService.loginRedirect({
      ...loginRequest
    });
  }

  logout(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/'
    });
  }
}
