package com.justlamvt05.bookshop.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequest {
    private String productId;
    private Integer quantity;
}
