package com.justlamvt05.bookshop.domain.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartProductDto {

    private String productId;
    private String name;
    private BigDecimal price;
    private String imageUrl;
}
