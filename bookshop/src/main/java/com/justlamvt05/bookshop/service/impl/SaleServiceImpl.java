package com.justlamvt05.bookshop.service.impl;

import com.justlamvt05.bookshop.domain.dto.ProductReportDto;
import com.justlamvt05.bookshop.domain.entity.Product;
import com.justlamvt05.bookshop.domain.entity.ProductImage;
import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import com.justlamvt05.bookshop.domain.repository.ProductImageRepository;
import com.justlamvt05.bookshop.domain.repository.ProductRepository;
import com.justlamvt05.bookshop.exception.EntityNotFoundException;
import com.justlamvt05.bookshop.payload.request.AddMultipleProductImageRequest;
import com.justlamvt05.bookshop.payload.request.ProductImageRequest;
import com.justlamvt05.bookshop.payload.request.ProductRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.SaleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SaleServiceImpl implements SaleService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Override
    public ApiResponse<?> createProduct(ProductRequest request) {
        log.info("ProductRequest: {}", request);
        String id = generateProductId();
        Product product = Product.builder()
                .productId(id)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .status(EStatus.ACTIVE)
                .build();

        productRepository.save(product);
        return ApiResponse.success("Product created");
    }
    private String generateProductId() {
        Long nextVal = productRepository.getNextProductSeq();
        return String.format("P%05d", nextVal);
    }
    @Override
    public ApiResponse<?> updateProduct(String productId, ProductRequest request) {
        log.info("productId: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());

        return ApiResponse.success("Product updated");
    }

    @Override
    public ApiResponse<?> deleteProduct(String productId) {
        log.info("productId: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        product.setStatus(EStatus.INACTIVE);
        return ApiResponse.success("Product soft deleted");
    }

    @Override
    public ApiResponse<?> getProducts(int page, int size, String sortBy, String direction, String keyword, String status) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> products = productRepository.search(
                 keyword, status, pageable
        );

        return ApiResponse.success(products);
    }

    @Override
    public byte[] exportProductPdf() {
        try {
            InputStream jrxml = getClass()
                    .getResourceAsStream("/reports/product_list.jrxml");

            JasperReport jasperReport =
                    JasperCompileManager.compileReport(jrxml);

            List<Product> products = productRepository.findAll();

            List<ProductReportDto> reportData = products.stream()
                    .map(p -> ProductReportDto.builder()
                            .productId(p.getProductId())
                            .name(p.getName())
                            .status(p.getStatus().name())
                            .price(p.getPrice())
                            .quantity(p.getQuantity())
                            .build())
                    .toList();

            JRBeanCollectionDataSource dataSource =
                    new JRBeanCollectionDataSource(reportData);


            Map<String, Object> params = new HashMap<>();
            params.put("createdBy", "BookShop System");

            JasperPrint jasperPrint =
                    JasperFillManager.fillReport(jasperReport, params, dataSource);

            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            throw new RuntimeException("Export product PDF failed", e);
        }
    }

    @Override
    public ApiResponse<?> addProductImage(String productId, ProductImageRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        ProductImage image = ProductImage.builder()
                .imageId(UUID.randomUUID().toString())
                .url(request.getUrl())
                .product(product)
                .isMain(false)
                .status(EStatus.ACTIVE)
                .build();

        productImageRepository.save(image);

        return ApiResponse.success("Image added to product");
    }

    @Override
    public ApiResponse<?> addMultipleProductImages(String productId, AddMultipleProductImageRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        List<ProductImage> images = request.getUrls().stream()
                .map(url -> ProductImage.builder()
                        .imageId(UUID.randomUUID().toString())
                        .url(url)
                        .product(product)
                        .isMain(false)
                        .status(EStatus.ACTIVE)
                        .build())
                .toList();

        productImageRepository.saveAll(images);

        return ApiResponse.success("Images added");
    }

    @Override
    public ApiResponse<?> getProductImages(String productId) {
        return ApiResponse.success(
                productImageRepository.findByProductId(productId)
        );
    }

    @Override
    public ApiResponse<?> deleteProductImage(String imageId) {
        if (!productImageRepository.existsById(imageId)) {
            throw new EntityNotFoundException("Image not found");
        }

        productImageRepository.deleteById(imageId);
        return ApiResponse.success("Image deleted");
    }
}
