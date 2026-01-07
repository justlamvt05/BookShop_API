package com.justlamvt05.bookshop.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class OrderDto {
    private String orderId;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String qrCodeUrl;
    private LocalDateTime createdAt;
}
