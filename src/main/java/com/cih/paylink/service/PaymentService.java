package com.cih.paylink.service;

import com.cih.paylink.model.Payment;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentService {

    private final Map<String, Payment> payments = new HashMap<>();
    private final MerchantService merchantService;

    public PaymentService(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    public Payment createPayment(String merchantId, Double amount, String currency) {
        Payment payment = new Payment();
        payment.setMerchantId(merchantId);
        payment.setAmount(amount);
        payment.setCurrency(currency);
        payment.setAmountMAD(amount * 10.0); // Conversion simplifiée

        payments.put(payment.getId(), payment);
        return payment;
    }

    public Payment processPayment(String paymentId, String cardNumber, String cvv,
                                  String expiryDate, String customerEmail) {
        Payment payment = payments.get(paymentId);

        if (payment == null) {
            throw new RuntimeException("Payment not found");
        }

        // Simulation processing (toujours succès pour la démo)
        try {
            Thread.sleep(2000); // Simule délai processing
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Simuler succès
        payment.setStatus("COMPLETED");
        payment.setCompletedAt(LocalDateTime.now());
        payment.setCustomerEmail(customerEmail);
        payment.setCardLast4(cardNumber.substring(cardNumber.length() - 4));

        // Mettre à jour balance merchant
        merchantService.updateBalance(payment.getMerchantId(), payment.getAmount());

        return payment;
    }

    public Payment getPayment(String paymentId) {
        return payments.get(paymentId);
    }

    public List<Payment> getMerchantPayments(String merchantId) {
        return payments.values().stream()
                .filter(p -> p.getMerchantId().equals(merchantId))
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .toList();
    }
}