package com.justlamvt05.bookshop.domain.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponseDto {

    private String cartId;
    private List<CartItemResponseDto> items;
}
