package com.quantumshop.basketservice.model;
import java.io.Serializable;
import java.io.Serial;


public class BasketItem implements Serializable{

    @Serial
    private static final long serialVersionUID = 1L;

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
