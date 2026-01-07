package com.justlamvt05.bookshop.payload.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderRequest {

    @NotEmpty
    private List<OrderItemRequest> items;
}
