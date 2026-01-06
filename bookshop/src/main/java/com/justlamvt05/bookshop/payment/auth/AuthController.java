package com.justlamvt05.bookshop.payment.auth;

import com.justlamvt05.bookshop.domain.dto.UserDto;
import com.justlamvt05.bookshop.payload.request.LoginRequest;

import com.justlamvt05.bookshop.payload.request.RegisterRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.payload.response.JwtResponse;
import com.justlamvt05.bookshop.security.jwt.JwtUtils;
import com.justlamvt05.bookshop.service.impl.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthServiceImpl authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody LoginRequest loginRequest) {
        log.info("Login request: {}", loginRequest.getUsername());
        UserDto userDto = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken
                        (loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtils.generateToken(authentication);

        return ResponseEntity.ok(ApiResponse.success(
                JwtResponse.builder()
                        .type("Bearer")
                        .token(token)
                        .username(userDto.getUserName())
                        .roles(userDto.getRole().getName().name())
                        .build()));

    }
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));
    }

}
