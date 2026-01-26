package com.justlamvt05.bookshop.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemDto {
    private Long orderItemId;
    private String productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
}