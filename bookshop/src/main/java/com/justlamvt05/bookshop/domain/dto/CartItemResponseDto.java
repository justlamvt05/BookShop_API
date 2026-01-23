package com.justlamvt05.bookshop.domain.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemResponseDto {

    private String cartItemId;
    private Integer quantity;
    private CartProductDto product;
}
