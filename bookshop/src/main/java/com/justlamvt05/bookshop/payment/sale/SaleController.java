package com.justlamvt05.bookshop.payment.sale;

import com.justlamvt05.bookshop.payload.request.AddMultipleProductImageRequest;
import com.justlamvt05.bookshop.payload.request.ProductImageRequest;
import com.justlamvt05.bookshop.payload.request.ProductRequest;
import com.justlamvt05.bookshop.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/sale")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;


    @GetMapping("/products")
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(
                saleService.getProducts(page, size, sortBy, direction, keyword, status)
        );
    }

    @PostMapping("/products")
    public ResponseEntity<?> create(@RequestBody ProductRequest request) {
        return ResponseEntity.ok(saleService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(saleService.updateProduct(id, request));
    }

    @PatchMapping("/products/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return ResponseEntity.ok(saleService.deleteProduct(id));
    }

    @GetMapping("/products/export-pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] pdf = saleService.exportProductPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=products.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
    @PostMapping(value = "/{productId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addImage(
            @PathVariable String productId,
            @ModelAttribute ProductImageRequest request
    ) {
        return ResponseEntity.ok(
                saleService.addProductImage(productId, request)
        );
    }

    @PostMapping("/{productId}/images/batch")
    public ResponseEntity<?> uploadProductImages(
            @PathVariable String productId,
            @RequestParam("files") List<MultipartFile> files
    ) {
        return ResponseEntity.ok(
                saleService.addMultipleProductImages(productId, files)
        );
    }

    @GetMapping("/{productId}/images")
    public ResponseEntity<?> getImages(@PathVariable String productId) {
        return ResponseEntity.ok(
                saleService.getProductImages(productId)
        );
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable String imageId) {
        return ResponseEntity.ok(
                saleService.deleteProductImage(imageId)
        );
    }
}
