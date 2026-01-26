package com.justlamvt05.bookshop.service;

import com.justlamvt05.bookshop.payload.request.AddMultipleProductImageRequest;
import com.justlamvt05.bookshop.payload.request.ProductImageRequest;
import com.justlamvt05.bookshop.payload.request.ProductRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SaleService {

    ApiResponse<?> createProduct(ProductRequest request);

    ApiResponse<?> updateProduct(String productId, ProductRequest request);

    ApiResponse<?> deleteProduct(String productId); // soft delete

    ApiResponse<?> getProducts(int page, int size, String sortBy, String direction,
                               String keyword, String status);

    byte[] exportProductPdf();

    ApiResponse<?> addProductImage(String productId, ProductImageRequest request);

    ApiResponse<?> addMultipleProductImages(
            String productId,
            List<MultipartFile> files
    );

    ApiResponse<?> getProductImages(String productId);

    ApiResponse<?> deleteProductImage(String imageId);

//    ApiResponse<?> getOrderList(int page, int size, String sortBy, String direction,
//                                String keyword, String status)
}
