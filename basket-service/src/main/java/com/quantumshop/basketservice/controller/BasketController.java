package com.quantumshop.basketservice.controller;

import com.quantumshop.basketservice.model.BasketItem;
import com.quantumshop.basketservice.service.BasketService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/basket")
public class BasketController {

    private final BasketService service;

    public BasketController(BasketService service) {

        this.service = service;
    }

    // EĞER DÜZ GET ATACAKSAN:
    @GetMapping
    public String getBasketSummary() {
        return "Sepet servisinden merhaba! Redis entegrasyonu aktif.";
    }

    // VEYA KULLANICIYA GÖRE ÇEKECEKSEN:
    @GetMapping("/{userId}")
    public String getBasketByUserId(@PathVariable String userId) {
        return userId + " id'li kullanıcının sepeti.";
    }

    /* / YENİ EKLEYECEĞİMİZ GET METODU (Sepetteki elemanları listeler)
    @GetMapping
    public List<BasketItem> getBasket() {
        // Not: Service katmanında tüm sepeti dönen bir metodun (örn: getAllItems)
        // olduğunu varsayarak bu satırı ekliyoruz.
        return service.getAllItems();
    }  */

    @PostMapping
    public BasketItem add(@RequestBody BasketItem item) {
        return service.addItem(item);
    }

}
