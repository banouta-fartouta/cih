// components/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Merchant } from '../../models/merchant.model';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <!-- Création compte merchant -->
      <div *ngIf="!merchant" class="create-merchant">
        <h2>🏦 Créer votre compte CIH PayLink</h2>
        <p class="subtitle">Commencez à accepter des paiements en ligne</p>
        <form (ngSubmit)="createMerchant()">
          <input [(ngModel)]="businessName" name="businessName" 
                 placeholder="Nom de l'entreprise" required>
          <input [(ngModel)]="email" name="email" type="email" 
                 placeholder="Email professionnel" required>
          <input [(ngModel)]="phoneNumber" name="phoneNumber" 
                 placeholder="Téléphone (212...)" required>
          <button type="submit">✨ Créer mon compte</button>
        </form>
      </div>

      <!-- Dashboard principal -->
      <div *ngIf="merchant" class="main-dashboard">
        <header>
          <h1>👋 Bienvenue, {{merchant.businessName}}</h1>
          <p class="wallet-id">
            <span class="label">Wallet CIH :</span> 
            <span class="value">{{merchant.walletId}}</span>
          </p>
        </header>

        <!-- Soldes (Local + CIH Wallet) -->
        <div class="balances">
          <div class="balance-card local">
            <div class="card-header">
              <h3>💰 Solde Local</h3>
              <span class="badge">Cache</span>
            </div>
            <p class="amount">{{merchant.balance | number:'1.2-2'}} MAD</p>
            <p class="amount-usd">≈ {{merchant.balanceUSD | number:'1.2-2'}} USD</p>
          </div>
          
          <div class="balance-card cih">
            <div class="card-header">
              <h3>🏦 Wallet CIH Bank</h3>
              <span class="badge live">En direct</span>
            </div>
            <p class="amount">{{cihWalletBalance | number:'1.2-2'}} MAD</p>
            <p class="amount-usd">≈ {{(cihWalletBalance / 10) | number:'1.2-2'}} USD</p>
          </div>
        </div>

        <!-- Générateur lien de paiement -->
        <div class="payment-link-generator">
          <h2>🔗 Générer un lien de paiement</h2>
          <div class="form-group">
            <label>Montant (USD)</label>
            <input type="number" [(ngModel)]="paymentAmount" 
                   placeholder="100.00" min="1" step="0.01">
          </div>
          <button (click)="generatePaymentLink()" class="btn-primary">
            🚀 Générer le lien
          </button>
          
          <div *ngIf="paymentLink" class="payment-link-result">
            <p class="success-message">✅ Lien généré avec succès !</p>
            <div class="link-container">
              <input [value]="paymentLink" readonly>
              <button (click)="copyLink()" class="btn-copy">📋 Copier</button>
            </div>
            <p class="hint">Envoyez ce lien à votre client pour qu'il paie</p>
          </div>
        </div>

        <!-- Historique transactions -->
        <div class="transactions">
          <h2>📊 Transactions récentes</h2>
          <table *ngIf="payments.length > 0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Montant</th>
                <th>Status</th>
                <th>Email Client</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let payment of payments">
                <td class="payment-id">{{payment.id}}</td>
                <td class="amount-cell">
                  <span class="amount">{{payment.amount}} USD</span>
                  <span class="mad">({{payment.amountMAD}} MAD)</span>
                </td>
                <td>
                  <span [class]="'status-badge status-' + payment.status.toLowerCase()">
                    {{payment.status}}
                  </span>
                </td>
                <td>{{payment.customerEmail || '-'}}</td>
                <td>{{payment.createdAt | date:'short'}}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="payments.length === 0" class="no-transactions">
            <p>💡 Aucune transaction pour le moment</p>
            <p class="hint">Générez un lien de paiement pour commencer</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: calc(100vh - 80px);
      background: #f5f5f5;
      padding: 20px;
    }

    .create-merchant {
      max-width: 500px;
      margin: 100px auto;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .create-merchant h2 {
      margin-bottom: 10px;
      color: #0066cc;
      font-size: 28px;
    }

    .subtitle {
      color: #666;
      margin-bottom: 30px;
    }

    .create-merchant form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .create-merchant input {
      padding: 14px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .create-merchant input:focus {
      border-color: #0066cc;
    }

    .create-merchant button {
      padding: 14px;
      background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .create-merchant button:hover {
      transform: translateY(-2px);
    }

    .main-dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 30px;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    header h1 {
      color: #0066cc;
      margin-bottom: 10px;
      font-size: 32px;
    }

    .wallet-id {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .wallet-id .label {
      color: #666;
      font-weight: 500;
    }

    .wallet-id .value {
      background: #f0f7ff;
      color: #0066cc;
      padding: 4px 12px;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 600;
    }

    .balances {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .balance-card {
      background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,102,204,0.3);
    }

    .balance-card.cih {
      background: linear-gradient(135deg, #00a651 0%, #008a43 100%);
      box-shadow: 0 4px 15px rgba(0,166,81,0.3);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }

    .badge {
      background: rgba(255,255,255,0.2);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge.live {
      background: rgba(255,255,255,0.3);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .balance-card .amount {
      font-size: 36px;
      font-weight: bold;
      margin: 10px 0 5px 0;
    }

    .balance-card .amount-usd {
      font-size: 16px;
      opacity: 0.8;
      margin: 0;
    }

    .payment-link-generator,
    .transactions {
      background: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .payment-link-generator h2,
    .transactions h2 {
      margin-top: 0;
      color: #333;
      font-size: 22px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      border-color: #0066cc;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
      color: white;
      padding: 14px 28px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
    }

    .payment-link-result {
      margin-top: 25px;
      padding: 20px;
      background: #f0f7ff;
      border-radius: 8px;
      border: 2px solid #cce5ff;
    }

    .success-message {
      color: #00a651;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .link-container {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .link-container input {
      flex: 1;
      padding: 12px;
      border: 2px solid #0066cc;
      border-radius: 8px;
      font-family: monospace;
      font-size: 14px;
      background: white;
    }

    .btn-copy {
      padding: 12px 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      white-space: nowrap;
    }

    .btn-copy:hover {
      background: #0052a3;
    }

    .hint {
      color: #666;
      font-size: 13px;
      margin: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      text-align: left;
      padding: 14px;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .payment-id {
      font-family: monospace;
      font-size: 13px;
      color: #666;
    }

    .amount-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .amount-cell .amount {
      font-weight: 600;
      color: #333;
    }

    .amount-cell .mad {
      font-size: 12px;
      color: #666;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.status-completed {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-badge.status-failed {
      background: #f8d7da;
      color: #721c24;
    }

    .no-transactions {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-transactions p {
      margin: 10px 0;
    }

    .no-transactions .hint {
      color: #999;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  merchant: Merchant | null = null;
  payments: Payment[] = [];
  cihWalletBalance: number = 0;
  
  // Form data
  businessName = '';
  email = '';
  phoneNumber = '';
  paymentAmount = 100;
  paymentLink = '';
  
  private refreshInterval: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    const savedMerchantId = localStorage.getItem('merchantId');
    if (savedMerchantId) {
      this.loadMerchant(savedMerchantId);
    }
  }
  
  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  createMerchant() {
    this.api.createMerchant({
      businessName: this.businessName,
      email: this.email,
      phoneNumber: this.phoneNumber
    }).subscribe(merchant => {
      this.merchant = merchant;
      localStorage.setItem('merchantId', merchant.id);
      this.loadPayments();
      this.loadCIHWallet();
      this.startAutoRefresh();
    });
  }

  loadMerchant(id: string) {
    this.api.getMerchant(id).subscribe(merchant => {
      this.merchant = merchant;
      this.loadPayments();
      this.loadCIHWallet();
      this.startAutoRefresh();
    });
  }

  loadPayments() {
    if (this.merchant) {
      this.api.getMerchantPayments(this.merchant.id).subscribe(payments => {
        this.payments = payments;
      });
    }
  }
  
  // Charger le solde du wallet CIH (selon Section 4.4 de la doc)
  loadCIHWallet() {
    if (this.merchant?.walletId) {
      this.api.getWalletBalance(this.merchant.walletId).subscribe(response => {
        if (response.result?.balance?.[0]?.value) {
          this.cihWalletBalance = parseFloat(response.result.balance[0].value);
        }
      });
    }
  }
  
  // Auto-refresh toutes les 3 secondes
  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      if (this.merchant) {
        this.api.getMerchant(this.merchant.id).subscribe(m => {
          this.merchant = m;
        });
        this.loadPayments();
        this.loadCIHWallet();
      }
    }, 3000);
  }

  generatePaymentLink() {
    if (!this.merchant) return;
    
    this.api.createPayment({
      merchantId: this.merchant.id,
      amount: this.paymentAmount,
      currency: 'USD'
    }).subscribe(payment => {
      this.paymentLink = `http://localhost:4200/pay/${payment.id}`;
    });
  }

  copyLink() {
    navigator.clipboard.writeText(this.paymentLink);
    alert('✅ Lien copié dans le presse-papier !');
  }
}