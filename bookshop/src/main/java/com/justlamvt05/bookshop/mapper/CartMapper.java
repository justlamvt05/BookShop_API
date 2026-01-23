package com.justlamvt05.bookshop.mapper;

import com.justlamvt05.bookshop.domain.dto.CartItemResponseDto;
import com.justlamvt05.bookshop.domain.dto.CartProductDto;
import com.justlamvt05.bookshop.domain.dto.CartResponseDto;
import com.justlamvt05.bookshop.domain.entity.Cart;
import com.justlamvt05.bookshop.domain.entity.CartItem;
import com.justlamvt05.bookshop.domain.entity.Product;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartMapper {

    public CartResponseDto toCartResponse(Cart cart) {

        List<CartItemResponseDto> items = cart.getItems().stream()
                .map(this::toCartItemResponse)
                .toList();

        return CartResponseDto.builder()
                .cartId(cart.getCartId())
                .items(items)
                .build();
    }

    private CartItemResponseDto toCartItemResponse(CartItem item) {

        Product p = item.getProduct();

        return CartItemResponseDto.builder()
                .cartItemId(item.getCartItemId())
                .quantity(item.getQuantity())
                .product(
                        CartProductDto.builder()
                                .productId(p.getProductId())
                                .name(p.getName())
                                .price(p.getPrice())
                                .imageUrl(p.getImages().getFirst().getUrl())
                                .build()
                )
                .build();
    }
}
