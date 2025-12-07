// controller/PaymentController.java
package com.cih.paylink.controller;

import com.cih.paylink.model.Payment;
import com.cih.paylink.service.PaymentService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public Payment createPayment(@RequestBody PaymentRequest request) {
        return paymentService.createPayment(
                request.merchantId(),
                request.amount(),
                request.currency()
        );
    }

    @PostMapping("/{id}/process")
    public Payment processPayment(
            @PathVariable String id,
            @RequestBody ProcessPaymentRequest request) {
        return paymentService.processPayment(
                id,
                request.cardNumber(),
                request.cvv(),
                request.expiryDate(),
                request.customerEmail()
        );
    }

    @GetMapping("/{id}")
    public Payment getPayment(@PathVariable String id) {
        return paymentService.getPayment(id);
    }

    @GetMapping("/merchant/{merchantId}")
    public List<Payment> getMerchantPayments(@PathVariable String merchantId) {
        return paymentService.getMerchantPayments(merchantId);
    }

    record PaymentRequest(String merchantId, Double amount, String currency) {}
    record ProcessPaymentRequest(String cardNumber, String cvv,
                                 String expiryDate, String customerEmail) {}
}