package com.justlamvt05.bookshop.payment.user;

import com.justlamvt05.bookshop.domain.dto.ProductDto;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.UserProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class UserProductController {

    private final UserProductService service;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> list(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String categoryId
    ) {
        return ResponseEntity.ok(
                service.getActiveProducts(page, size, sortBy, direction, keyword, categoryId)
        );
    }
}
