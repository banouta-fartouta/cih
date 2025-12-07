package com.cih.paylink.service;

import com.cih.paylink.model.CIHWalletResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class CIHWalletService {

    private static final Double EXCHANGE_RATE = 10.0;

    // Simuler le stockage des balances par walletId
    private final Map<String, Double> walletBalances = new HashMap<>();

    // Simuler l'historique des opérations par walletId
    private final Map<String, List<Map<String, Object>>> walletOperations = new HashMap<>();

    public CIHWalletResponse createWallet(String phoneNumber, String email) {
        CIHWalletResponse response = new CIHWalletResponse();
        String contractId = "LAN" + System.currentTimeMillis();

        response.setContractId(contractId);
        response.setStatus("ACTIVE");
        response.setBalance(0.0);
        response.setCurrency("MAD");
        response.setMessage("Wallet created successfully");

        // Initialiser le solde à 0
        walletBalances.put(contractId, 0.0);
        walletOperations.put(contractId, new ArrayList<>());

        return response;
    }

    public CIHWalletResponse getBalance(String walletId) {
        CIHWalletResponse response = new CIHWalletResponse();
        response.setContractId(walletId);
        response.setStatus("ACTIVE");

        // Récupérer le vrai solde ou retourner 0
        Double balance = walletBalances.getOrDefault(walletId, 0.0);
        response.setBalance(balance);
        response.setCurrency("MAD");

        return response;
    }

    public CIHWalletResponse creditWallet(String walletId, Double amountUSD) {
        Double amountMAD = amountUSD * EXCHANGE_RATE;

        // Mettre à jour le solde
        Double currentBalance = walletBalances.getOrDefault(walletId, 0.0);
        Double newBalance = currentBalance + amountMAD;
        walletBalances.put(walletId, newBalance);

        // Ajouter une transaction dans l'historique (selon doc CIH Section 4.3)
        addOperation(walletId, "CREDIT", amountMAD, "Payment received");

        CIHWalletResponse response = new CIHWalletResponse();
        response.setContractId(walletId);
        response.setStatus("SUCCESS");
        response.setBalance(newBalance);
        response.setCurrency("MAD");
        response.setMessage("Wallet credited: " + amountMAD + " MAD");

        return response;
    }

    // Nouvelle méthode pour obtenir l'historique (Section 4.3 de la doc CIH)
    public List<Map<String, Object>> getOperations(String walletId) {
        return walletOperations.getOrDefault(walletId, new ArrayList<>());
    }

    // Méthode privée pour ajouter une opération
    private void addOperation(String walletId, String type, Double amount, String note) {
        List<Map<String, Object>> operations = walletOperations.get(walletId);
        if (operations == null) {
            operations = new ArrayList<>();
            walletOperations.put(walletId, operations);
        }

        Map<String, Object> operation = new HashMap<>();
        operation.put("amount", String.format("%.2f", amount));
        operation.put("Fees", "0");
        operation.put("currency", "MAD");
        operation.put("type", type);
        operation.put("status", "000"); // Success code selon doc CIH
        operation.put("clientNote", note);
        operation.put("date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm:ss a")));
        operation.put("referenceId", String.valueOf(System.currentTimeMillis()));
        operation.put("totalAmount", String.format("%.2f", amount));
        operation.put("totalFrai", "0.00");

        operations.add(0, operation); // Ajouter au début (plus récent en premier)
    }
}