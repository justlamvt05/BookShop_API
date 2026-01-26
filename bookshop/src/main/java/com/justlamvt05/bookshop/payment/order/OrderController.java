package com.justlamvt05.bookshop.payment.order;

import com.justlamvt05.bookshop.payload.request.CreateOrderRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.security.service.UserDetailsImpl;
import com.justlamvt05.bookshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> create(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody @Valid CreateOrderRequest request) {

        return ResponseEntity.ok(
                orderService.createOrder(user.getUserId(), request)
        );
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<?>> confirm(@PathVariable Long id) {

        return ResponseEntity.ok(
                orderService.confirmPayment(id)
        );
    }
}

