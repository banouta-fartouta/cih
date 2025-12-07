package com.cih.paylink.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Merchant {
    private String id;
    private String businessName;
    private String email;
    private String phoneNumber;
    private String walletId;
    private Double balance;
    private Double balanceUSD;
    private LocalDateTime createdAt;

    public Merchant() {
        this.id = "MERCH_" + System.currentTimeMillis();
        this.createdAt = LocalDateTime.now();
        this.balance = 0.0;
        this.balanceUSD = 0.0;
    }
}