package com.justlamvt05.bookshop.service.impl;

import com.justlamvt05.bookshop.domain.entity.Order;
import com.justlamvt05.bookshop.domain.entity.OrderItem;
import com.justlamvt05.bookshop.domain.entity.Product;
import com.justlamvt05.bookshop.domain.entity.User;
import com.justlamvt05.bookshop.domain.entity.constraint.EPaymentStatus;
import com.justlamvt05.bookshop.domain.repository.OrderItemRepository;
import com.justlamvt05.bookshop.domain.repository.OrderRepository;
import com.justlamvt05.bookshop.domain.repository.ProductRepository;
import com.justlamvt05.bookshop.domain.repository.UserRepository;
import com.justlamvt05.bookshop.exception.UserNotFoundException;
import com.justlamvt05.bookshop.mapper.OrderMapper;
import com.justlamvt05.bookshop.payload.request.CreateOrderRequest;
import com.justlamvt05.bookshop.payload.request.OrderItemRequest;
import com.justlamvt05.bookshop.payload.response.ApiCode;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final OrderMapper orderMapper;
    @Value("${qr.url.example}")
    private String url;
    @Override
    public ApiResponse<?> createOrder(String userId, CreateOrderRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Order order = new Order();
        order.setUser(user);
        order.setPaymentStatus(EPaymentStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepo.findActiveById(itemReq.getProductId())
                    .orElseThrow(() -> new UserNotFoundException("Product not found"));
            if (itemReq.getQuantity() > product.getQuantity()) {
                throw new IllegalArgumentException("Quantity exceeds stock");
            }
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice());

            order.getOrderItems().add(item);
            total = total.add(
                    product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()))
            );
        }
        order.setTotalAmount(total);
        Order savedOrder = orderRepo.save(order);

        savedOrder.setQrCodeUrl(url);
        savedOrder = orderRepo.save(savedOrder);

        return ApiResponse.create(orderMapper.toDto(savedOrder));
    }

    @Override
    public ApiResponse<?> confirmPayment(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new UserNotFoundException("Order not found"));

        if (order.getPaymentStatus() == EPaymentStatus.SUCCESS) {
            return ApiResponse.error(ApiCode.BAD_REQUEST, "Order already confirmed");
        }

        order.setPaymentStatus(EPaymentStatus.SUCCESS);

        // Trừ kho
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepo.save(product);
        }

        return ApiResponse.success("Payment confirmed");
    }
}

