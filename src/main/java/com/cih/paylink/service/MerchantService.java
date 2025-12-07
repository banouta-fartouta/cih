package com.cih.paylink.service;

import com.cih.paylink.model.Merchant;
import com.cih.paylink.model.CIHWalletResponse;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class MerchantService {

    private final Map<String, Merchant> merchants = new HashMap<>();
    private final CIHWalletService walletService;

    public MerchantService(CIHWalletService walletService) {
        this.walletService = walletService;
    }

    public Merchant createMerchant(String businessName, String email, String phone) {
        Merchant merchant = new Merchant();
        merchant.setBusinessName(businessName);
        merchant.setEmail(email);
        merchant.setPhoneNumber(phone);

        // Créer wallet CIH (selon Section 4.1 de la doc)
        CIHWalletResponse wallet = walletService.createWallet(phone, email);
        merchant.setWalletId(wallet.getContractId());

        merchants.put(merchant.getId(), merchant);
        return merchant;
    }

    public Merchant getMerchant(String merchantId) {
        Merchant merchant = merchants.get(merchantId);

        // Synchroniser avec le solde réel du wallet CIH
        if (merchant != null && merchant.getWalletId() != null) {
            CIHWalletResponse walletBalance = walletService.getBalance(merchant.getWalletId());
            merchant.setBalance(walletBalance.getBalance()); // Balance en MAD
            merchant.setBalanceUSD(walletBalance.getBalance() / 10.0); // Conversion USD
        }

        return merchant;
    }

    public void updateBalance(String merchantId, Double amountUSD) {
        Merchant merchant = merchants.get(merchantId);
        if (merchant != null) {
            // Mettre à jour solde local
            merchant.setBalanceUSD(merchant.getBalanceUSD() + amountUSD);
            merchant.setBalance(merchant.getBalance() + (amountUSD * 10.0));

            // Créditer wallet CIH (selon Section 4.5 de la doc)
            walletService.creditWallet(merchant.getWalletId(), amountUSD);
        }
    }

    // Nouvelle méthode pour obtenir le wallet CIH du merchant
    public CIHWalletResponse getMerchantWallet(String merchantId) {
        Merchant merchant = merchants.get(merchantId);
        if (merchant != null && merchant.getWalletId() != null) {
            return walletService.getBalance(merchant.getWalletId());
        }
        return null;
    }
}