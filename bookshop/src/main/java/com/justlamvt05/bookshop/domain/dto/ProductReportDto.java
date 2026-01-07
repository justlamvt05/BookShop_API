package com.justlamvt05.bookshop.domain.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductReportDto {
    private String productId;
    private String name;
    private String status;
    private BigDecimal price;
    private Integer quantity;
}
