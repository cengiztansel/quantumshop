package com.quantumshop.productservice.dto;
import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class ProductDTO {

    private Long id;
    @NotBlank(message = "Product name is mandatory")
    private String name;
    @NotBlank(message = "Description is mandatory")
    private String description;
    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;
    @PositiveOrZero(message = "Stock cannot be negative")
    private Integer stockQuantity;

    public ProductDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

}
