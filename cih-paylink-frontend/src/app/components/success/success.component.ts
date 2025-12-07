// components/success/success.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-page">
      <div class="success-container" *ngIf="payment">
        <div class="success-animation">
          <div class="checkmark-circle">
            <div class="checkmark">✓</div>
          </div>
        </div>
        
        <h1>🎉 Paiement réussi !</h1>
        <p class="message">Votre paiement a été traité avec succès</p>

        <div class="payment-info">
          <div class="info-card">
            <div class="info-row">
              <span class="label">💵 Montant payé</span>
              <span class="value highlight">{{payment.amount}} USD</span>
            </div>
            <div class="info-row">
              <span class="label">🏦 Équivalent MAD</span>
              <span class="value">{{payment.amountMAD}} MAD</span>
            </div>
            <div class="info-row">
              <span class="label">📧 Email</span>
              <span class="value">{{payment.customerEmail}}</span>
            </div>
            <div class="info-row">
              <span class="label">💳 Carte</span>
              <span class="value">•••• {{payment.cardLast4}}</span>
            </div>
            <div class="info-row">
              <span class="label">🔖 ID Transaction</span>
              <span class="value mono">{{payment.id}}</span>
            </div>
            <div class="info-row">
              <span class="label">📅 Date</span>
              <span class="value">{{payment.completedAt | date:'medium'}}</span>
            </div>
          </div>

          <div class="merchant-notification">
            <div class="notification-icon">🏦</div>
            <div class="notification-content">
              <h3>Le marchand a reçu les fonds</h3>
              <p>{{payment.amountMAD}} MAD ont été crédités sur le wallet CIH</p>
              <p class="wallet-badge">
                <span class="badge-icon">✓</span>
                Wallet CIH Bank synchronisé
              </p>
            </div>
          </div>
        </div>

        <div class="actions">
          <button (click)="close()" class="btn-close">
            ← Retour au site
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .success-container {
      max-width: 600px;
      width: 100%;
      background: white;
      border-radius: 16px;
      padding: 50px 40px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .success-animation {
      margin-bottom: 30px;
    }

    .checkmark-circle {
      width: 100px;
      height: 100px;
      margin: 0 auto;
      background: linear-gradient(135deg, #00a651 0%, #008a43 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: scaleIn 0.5s ease-out;
      box-shadow: 0 10px 30px rgba(0,166,81,0.3);
    }

    @keyframes scaleIn {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .checkmark {
      color: white;
      font-size: 60px;
      font-weight: bold;
      animation: checkmark 0.3s 0.3s ease-out both;
    }

    @keyframes checkmark {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }

    h1 {
      margin: 20px 0 10px 0;
      color: #333;
      font-size: 32px;
    }

    .message {
      color: #666;
      margin-bottom: 40px;
      font-size: 18px;
    }

    .payment-info {
      margin-bottom: 30px;
    }

    .info-card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 20px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .label {
      color: #666;
      font-weight: 500;
      font-size: 14px;
    }

    .value {
      color: #333;
      font-weight: 600;
      font-size: 15px;
      text-align: right;
    }

    .value.highlight {
      color: #00a651;
      font-size: 20px;
    }

    .value.mono {
      font-family: monospace;
      font-size: 12px;
      background: #e0e0e0;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .merchant-notification {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      gap: 15px;
      align-items: flex-start;
      text-align: left;
      border: 2px solid #81c784;
    }

    .notification-icon {
      font-size: 40px;
      flex-shrink: 0;
    }

    .notification-content {
      flex: 1;
    }

    .notification-content h3 {
      margin: 0 0 8px 0;
      color: #2e7d32;
      font-size: 18px;
    }

    .notification-content p {
      margin: 5px 0;
      color: #388e3c;
      font-size: 14px;
    }

    .wallet-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: white;
      padding: 6px 12px;
      border-radius: 20px;
      margin-top: 10px;
      font-weight: 600;
      color: #2e7d32;
      font-size: 13px;
    }

    .badge-icon {
      background: #4caf50;
      color: white;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .actions {
      margin-top: 30px;
    }

    .btn-close {
      padding: 14px 32px;
      background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-close:hover {
      transform: translateY(-2px);
    }
  `]
})
export class SuccessComponent implements OnInit {
  payment: Payment | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    const paymentId = this.route.snapshot.queryParamMap.get('paymentId');
    if (paymentId) {
      this.api.getPayment(paymentId).subscribe(payment => {
        this.payment = payment;
      });
    }
  }

  close() {
    window.close();
  }
}