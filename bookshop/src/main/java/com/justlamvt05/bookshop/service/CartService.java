package com.justlamvt05.bookshop.service;

import com.justlamvt05.bookshop.payload.response.ApiResponse;

public interface CartService {

    ApiResponse<?> getMyCart(String userId);

    ApiResponse<?> addToCart(String userId, String productId, Integer quantity);

    ApiResponse<?> updateCartItem(String userId, String productId, Integer quantity);

    ApiResponse<?> removeCartItem(String userId, String productId);

    ApiResponse<?> clearCart(String userId);
}
