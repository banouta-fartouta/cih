// controller/WalletController.java
package com.cih.paylink.controller;

import com.cih.paylink.model.CIHWalletResponse;
import com.cih.paylink.service.CIHWalletService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final CIHWalletService walletService;

    public WalletController(CIHWalletService walletService) {
        this.walletService = walletService;
    }

    // Endpoint CIH : Consultation du solde (Section 4.4)
    @GetMapping("/balance")
    public Map<String, Object> getBalance(@RequestParam String contractId) {
        CIHWalletResponse balance = walletService.getBalance(contractId);

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> result = new HashMap<>();
        Map<String, String> balanceItem = new HashMap<>();

        balanceItem.put("value", String.format("%.2f", balance.getBalance()));

        result.put("balance", new Map[] { balanceItem });
        response.put("result", result);

        return response;
    }

    // Endpoint CIH : Historique des transactions (Section 4.3)
    @GetMapping("/operations")
    public Map<String, Object> getOperations(@RequestParam String contractId) {
        // Simulation d'historique de transactions
        Map<String, Object> response = new HashMap<>();

        // Pour la démo, on retourne un historique vide ou mock
        response.put("result", new Object[0]);

        return response;
    }
}