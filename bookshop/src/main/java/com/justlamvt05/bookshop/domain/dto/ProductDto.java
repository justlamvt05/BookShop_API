package com.justlamvt05.bookshop.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductDto {
    private String productId;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private String status;
    private String categoryName;
}
