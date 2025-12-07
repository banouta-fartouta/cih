// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaymentPageComponent } from './components/payment-page/payment-page.component';
import { SuccessComponent } from './components/success/success.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'pay/:id', component: PaymentPageComponent },
  { path: 'success', component: SuccessComponent }
];