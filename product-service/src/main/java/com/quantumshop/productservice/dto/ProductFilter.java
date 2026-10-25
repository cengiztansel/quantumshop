package com.quantumshop.productservice.dto;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFilter {
    private String keyword;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String category;
    private Boolean inStock;
    private Boolean active;
}
