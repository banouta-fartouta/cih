package com.cih.paylink.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Payment {
    private String id;
    private String merchantId;
    private Double amount;
    private Double amountMAD;
    private String currency;
    private String status;
    private String customerEmail;
    private String cardLast4;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public Payment() {
        this.id = "PAY_" + System.currentTimeMillis();
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }
}