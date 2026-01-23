package com.justlamvt05.bookshop.service.impl;

import com.justlamvt05.bookshop.domain.dto.ProductView;
import com.justlamvt05.bookshop.domain.repository.ProductRepository;
import com.justlamvt05.bookshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;


    @Override
    public Page<ProductView> getActiveProducts(String categoryId, String keyword, BigDecimal minPrice, BigDecimal maxPrice, String sortBy, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchProducts(
                categoryId,
                keyword,
                minPrice,
                maxPrice,
                sortBy,
                pageable
        );
    }
}
