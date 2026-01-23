package com.justlamvt05.bookshop.payment.cart;

import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.security.service.UserDetailsImpl;
import com.justlamvt05.bookshop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getMyCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(
                cartService.getMyCart(userDetails.getUserId())
        );
    }


    @PostMapping("/add")
    public ResponseEntity<ApiResponse<?>> addToCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam String productId,
            @RequestParam Integer quantity
    ) {
        return ResponseEntity.ok(
                cartService.addToCart(userDetails.getUserId(), productId, quantity)
        );
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> updateCartItem(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam String productId,
            @RequestParam Integer quantity
    ) {
        return ResponseEntity.ok(
                cartService.updateCartItem(userDetails.getUserId(), productId, quantity)
        );
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<?>> removeCartItem(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String productId
    ) {
        return ResponseEntity.ok(
                cartService.removeCartItem(userDetails.getUserId(), productId)
        );
    }


    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<?>> clearCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(
                cartService.clearCart(userDetails.getUserId())
        );
    }
}
