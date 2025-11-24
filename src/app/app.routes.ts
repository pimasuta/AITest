import { Routes } from '@angular/router';
import { MainLayout } from './components/main-layout/main-layout';

export const routes: Routes = [
  { 
    path: '', 
    component: MainLayout
  },
  { path: '**', redirectTo: '' }
];
