// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Merchant } from '../models/merchant.model';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Merchants
  createMerchant(data: any): Observable<Merchant> {
    return this.http.post<Merchant>(`${this.apiUrl}/merchants`, data);
  }

  getMerchant(id: string): Observable<Merchant> {
    return this.http.get<Merchant>(`${this.apiUrl}/merchants/${id}`);
  }
  
  // Nouveau : Obtenir le wallet CIH du merchant
  getMerchantWallet(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/merchants/${id}/wallet`);
  }

  // Payments
  createPayment(data: any): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/payments`, data);
  }

  processPayment(paymentId: string, data: any): Observable<Payment> {
    return this.http.post<Payment>(
      `${this.apiUrl}/payments/${paymentId}/process`,
      data
    );
  }

  getPayment(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/payments/${id}`);
  }

  getMerchantPayments(merchantId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(
      `${this.apiUrl}/payments/merchant/${merchantId}`
    );
  }
  
  // Nouveau : Endpoints CIH Wallet (Section 4.3 et 4.4 de la doc)
  getWalletBalance(contractId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/wallet/balance?contractId=${contractId}`);
  }
  
  getWalletOperations(contractId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/wallet/operations?contractId=${contractId}`);
  }
}