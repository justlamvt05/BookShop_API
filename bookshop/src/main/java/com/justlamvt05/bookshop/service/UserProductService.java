package com.justlamvt05.bookshop.service;

import com.justlamvt05.bookshop.payload.response.ApiResponse;

public interface UserProductService {

    ApiResponse<?> getActiveProducts(
            int page,
            int size,
            String sortBy,
            String direction,
            String keyword,
            String categoryId
    );
}
