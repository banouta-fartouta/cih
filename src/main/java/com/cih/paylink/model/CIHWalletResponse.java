package com.cih.paylink.model;

import lombok.Data;

@Data
public class CIHWalletResponse {
    private String contractId;
    private String status;
    private Double balance;
    private String currency;
    private String message;
}