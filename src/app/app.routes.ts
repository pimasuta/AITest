import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { MainLayout } from './components/main-layout/main-layout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { 
    path: '', 
    component: MainLayout, 
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
