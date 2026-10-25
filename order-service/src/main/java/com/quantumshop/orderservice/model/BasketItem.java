package com.quantumshop.orderservice.model;

public class BasketItem {

    private String productName;
    private Integer quantity;

    public BasketItem() {
    }

    public BasketItem(String productName, Integer quantity) {
        this.productName = productName;
        this.quantity = quantity;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
