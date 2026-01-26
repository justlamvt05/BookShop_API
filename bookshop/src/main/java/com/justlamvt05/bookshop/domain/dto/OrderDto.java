package com.justlamvt05.bookshop.domain.dto;

import com.justlamvt05.bookshop.domain.entity.OrderItem;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class OrderDto {
    private String orderId;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String qrCodeUrl;
    private LocalDateTime createdAt;
    private Integer itemsCount;
    private Set<OrderItemDto> items;
}
