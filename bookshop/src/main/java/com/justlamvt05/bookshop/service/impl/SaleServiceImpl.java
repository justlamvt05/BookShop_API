package com.justlamvt05.bookshop.service.impl;

import com.justlamvt05.bookshop.domain.dto.ProductReportDto;
import com.justlamvt05.bookshop.domain.entity.Order;
import com.justlamvt05.bookshop.domain.entity.Product;
import com.justlamvt05.bookshop.domain.entity.ProductImage;
import com.justlamvt05.bookshop.domain.entity.constraint.EPaymentStatus;
import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import com.justlamvt05.bookshop.domain.repository.OrderRepository;
import com.justlamvt05.bookshop.domain.repository.ProductImageRepository;
import com.justlamvt05.bookshop.domain.repository.ProductRepository;
import com.justlamvt05.bookshop.exception.OrderNotFoundException;
import com.justlamvt05.bookshop.exception.UserNotFoundException;
import com.justlamvt05.bookshop.payload.request.ProductImageRequest;
import com.justlamvt05.bookshop.payload.request.ProductRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.SaleService;
import jakarta.persistence.EntityNotFoundException;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SaleServiceImpl implements SaleService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final OrderRepository orderRepository;

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
                .orElseThrow(() -> new UserNotFoundException("Product not found"));

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
                .orElseThrow(() -> new UserNotFoundException("Product not found"));
        if(product.getStatus() == EStatus.ACTIVE) {
            product.setStatus(EStatus.INACTIVE);
        }else {
            product.setStatus(EStatus.ACTIVE);
        }
        productRepository.save(product);
        return ApiResponse.success("Product toggle successfully");
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

        MultipartFile file = request.getFile();
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }


        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path uploadPath = Paths.get("C:/uploads/products");
        try {
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName));
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }

        //FE call
        String imageUrl = "/uploads/products/" + fileName;

        ProductImage image = ProductImage.builder()
                .imageId(UUID.randomUUID().toString())
                .url(imageUrl)
                .product(product)
                .isMain(Boolean.TRUE.equals(request.getIsMain()))
                .status(EStatus.ACTIVE)
                .build();

        productImageRepository.save(image);

        return ApiResponse.success("Image added to product");
    }


    @Override
    public ApiResponse<?> addMultipleProductImages(
            String productId,
            List<MultipartFile> files
    ) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new UserNotFoundException("Product not found"));

        String uploadDir = "C:/uploads/products/" + productId + "/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        List<ProductImage> images = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            // validate type
            String contentType = file.getContentType();
            if (!List.of("image/png", "image/jpeg", "image/jpg").contains(contentType)) {
                throw new RuntimeException("Invalid image type");
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            try {
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store image", e);
            }

            String imageUrl = "/uploads/products/" + productId + "/" + fileName;


            images.add(ProductImage.builder()
                    .imageId(UUID.randomUUID().toString())
                    .url(imageUrl)
                    .product(product)
                    .isMain(false)
                    .status(EStatus.ACTIVE)
                    .build());
        }

        productImageRepository.saveAll(images);

        return ApiResponse.success("Images uploaded successfully");
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
            throw new UserNotFoundException("Image not found");
        }

        productImageRepository.deleteById(imageId);
        return ApiResponse.success("Image deleted");
    }

    @Override
    public ApiResponse<?> getOrderList(int page, int size, String sortBy, String direction, String keyword, String status) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        EPaymentStatus eStatus = null;
        if(!Objects.isNull(status)) {
            eStatus = EPaymentStatus.valueOf(status);
        }
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Order> result = orderRepository.findAllOrders(pageable, keyword, eStatus);
        return ApiResponse.success(result);
    }

    @Override
    public ApiResponse<?> updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("Order not found"));
        EPaymentStatus eStatus = null;
        if(!Objects.isNull(status)) {
            eStatus = EPaymentStatus.valueOf(status);
            order.setPaymentStatus(eStatus);
            orderRepository.save(order);
        }
        return ApiResponse.success("Order updated successfully");

    }

    @Override
    public ApiResponse<?> getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order not found"));
        return ApiResponse.success(order);
    }
}
