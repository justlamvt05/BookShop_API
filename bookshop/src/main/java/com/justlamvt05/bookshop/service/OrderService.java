package com.justlamvt05.bookshop.service;

import com.justlamvt05.bookshop.payload.request.CreateOrderRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;

public interface OrderService {

    ApiResponse<?> createOrder(String userId, CreateOrderRequest request);

    ApiResponse<?> confirmPayment(Long orderId);
}
