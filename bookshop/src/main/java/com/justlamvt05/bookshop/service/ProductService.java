package com.justlamvt05.bookshop.service;

import com.justlamvt05.bookshop.domain.dto.ProductView;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;


public interface ProductService {

    Page<ProductView> getActiveProducts(String categoryId, String keyword, BigDecimal minPrice, BigDecimal maxPrice, String sortBy, int page, int size);
}
