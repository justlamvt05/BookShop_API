package com.justlamvt05.bookshop.service.impl;

import com.justlamvt05.bookshop.domain.dto.ProductDto;

import com.justlamvt05.bookshop.domain.repository.ProductRepository;
import com.justlamvt05.bookshop.mapper.ProductMapper;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.UserProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProductServiceImpl implements UserProductService {

    private final ProductRepository productRepo;
    private final ProductMapper productMapper;

    @Override
    public ApiResponse<?> getActiveProducts(
            int page,
            int size,
            String sortBy,
            String direction,
            String keyword,
            String categoryId) {

        Sort sort = direction.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductDto> result = productRepo
                .searchProduct(pageable, keyword, categoryId)
                .map(productMapper::toDto);

        return ApiResponse.success(result);
    }
}

