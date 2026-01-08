package com.justlamvt05.bookshop.payment.user;

import com.justlamvt05.bookshop.domain.dto.UpdateProfileRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.security.service.UserDetailsImpl;
import com.justlamvt05.bookshop.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<?>> me(
            @AuthenticationPrincipal UserDetailsImpl user) {

        return ResponseEntity.ok(
                userService.getMyProfile(user.getUserId())
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<?>> update(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody @Valid UpdateProfileRequest request) {

        return ResponseEntity.ok(
                userService.updateMyProfile(user.getUserId(), request)
        );
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<?>> myOrders(
            @AuthenticationPrincipal UserDetailsImpl user) {

        return ResponseEntity.ok(
                userService.getMyOrders(user.getUserId())
        );
    }
}

