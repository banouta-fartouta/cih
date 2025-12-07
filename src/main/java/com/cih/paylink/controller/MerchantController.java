// controller/MerchantController.java
package com.cih.paylink.controller;

import com.cih.paylink.model.Merchant;
import com.cih.paylink.model.CIHWalletResponse;
import com.cih.paylink.service.MerchantService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/merchants")
public class MerchantController {

    private final MerchantService merchantService;

    public MerchantController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    @PostMapping
    public Merchant createMerchant(@RequestBody MerchantRequest request) {
        return merchantService.createMerchant(
                request.businessName(),
                request.email(),
                request.phoneNumber()
        );
    }

    @GetMapping("/{id}")
    public Merchant getMerchant(@PathVariable String id) {
        return merchantService.getMerchant(id);
    }

    // Nouvel endpoint pour obtenir le wallet CIH du merchant
    @GetMapping("/{id}/wallet")
    public CIHWalletResponse getMerchantWallet(@PathVariable String id) {
        return merchantService.getMerchantWallet(id);
    }

    record MerchantRequest(String businessName, String email, String phoneNumber) {}
}