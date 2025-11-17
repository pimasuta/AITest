import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(MsalService);
  const router = inject(Router);

  // Check if running in browser
  if (typeof window === 'undefined') {
    return true; // Allow during SSR
  }

  const accounts = authService.instance.getAllAccounts();
  
  if (accounts.length > 0) {
    // User is authenticated
    return true;
  } else {
    // User is not authenticated, redirect to login
    router.navigate(['/login']);
    return false;
  }
};
