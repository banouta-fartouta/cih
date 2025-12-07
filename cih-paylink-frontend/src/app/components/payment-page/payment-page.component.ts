// components/payment-page/payment-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payment-page">
      <div class="payment-container" *ngIf="payment">
        <div class="payment-header">
          <h1>CIH PayLink</h1>
          <p>Paiement sécurisé</p>
        </div>

        <div class="payment-details">
          <h2>Montant à payer</h2>
          <p class="amount">{{payment.amount}} USD</p>
          <p class="amount-mad">(≈ {{payment.amountMAD}} MAD)</p>
        </div>

        <form (ngSubmit)="processPayment()" class="payment-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="customerEmail" 
                   name="email" required>
          </div>

          <div class="form-group">
            <label>Numéro de carte</label>
            <input type="text" [(ngModel)]="cardNumber" 
                   name="cardNumber" placeholder="4242 4242 4242 4242" 
                   maxlength="19" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date d'expiration</label>
              <input type="text" [(ngModel)]="expiryDate" 
                     name="expiry" placeholder="MM/YY" 
                     maxlength="5" required>
            </div>
            <div class="form-group">
              <label>CVV</label>
              <input type="text" [(ngModel)]="cvv" 
                     name="cvv" placeholder="123" 
                     maxlength="3" required>
            </div>
          </div>

          <button type="submit" class="btn-pay" [disabled]="processing">
            <span *ngIf="!processing">Payer {{payment.amount}} USD</span>
            <span *ngIf="processing">Traitement en cours...</span>
          </button>
        </form>

        <div class="security-info">
          <p>🔒 Paiement sécurisé par CIH Bank</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .payment-container {
      max-width: 500px;
      width: 100%;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      overflow: hidden;
    }

    .payment-header {
      background: #0066cc;
      color: white;
      padding: 30px;
      text-align: center;
    }

    .payment-header h1 {
      margin: 0 0 5px 0;
      font-size: 28px;
    }

    .payment-header p {
      margin: 0;
      opacity: 0.9;
    }

    .payment-details {
      padding: 30px;
      text-align: center;
      background: #f8f9fa;
    }

    .payment-details h2 {
      margin: 0 0 10px 0;
      font-size: 16px;
      color: #666;
    }

    .amount {
      font-size: 48px;
      font-weight: bold;
      color: #0066cc;
      margin: 0;
    }

    .amount-mad {
      margin: 5px 0 0 0;
      color: #666;
    }

    .payment-form {
      padding: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #0066cc;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 15px;
    }

    .btn-pay {
      width: 100%;
      padding: 16px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-pay:hover:not(:disabled) {
      background: #0052a3;
    }

    .btn-pay:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .security-info {
      padding: 20px 30px 30px;
      text-align: center;
      color: #666;
    }
  `]
})
export class PaymentPageComponent implements OnInit {
  payment: Payment | null = null;
  processing = false;

  // Form data
  customerEmail = '';
  cardNumber = '';
  expiryDate = '';
  cvv = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    const paymentId = this.route.snapshot.paramMap.get('id');
    if (paymentId) {
      this.api.getPayment(paymentId).subscribe(payment => {
        this.payment = payment;
      });
    }
  }

  processPayment() {
    if (!this.payment) return;

    this.processing = true;

    this.api.processPayment(this.payment.id, {
      cardNumber: this.cardNumber,
      cvv: this.cvv,
      expiryDate: this.expiryDate,
      customerEmail: this.customerEmail
    }).subscribe(
      payment => {
        this.processing = false;
        this.router.navigate(['/success'], { 
          queryParams: { paymentId: payment.id }
        });
      },
      error => {
        this.processing = false;
        alert('Erreur lors du paiement');
      }
    );
  }
}

