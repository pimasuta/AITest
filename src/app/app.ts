import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  title = 'Expense Splitter';
  private authService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    // Initialize MSAL if in browser
    if (typeof window !== 'undefined') {
      this.authService.instance.initialize().then(() => {
        // Handle redirect promise
        this.authService.instance.handleRedirectPromise().then((result) => {
          if (result) {
            this.authService.instance.setActiveAccount(result.account);
          }
        });
      });

      // Subscribe to interaction status
      this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          // Check if there's an active account
          const accounts = this.authService.instance.getAllAccounts();
          if (accounts.length > 0) {
            this.authService.instance.setActiveAccount(accounts[0]);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
