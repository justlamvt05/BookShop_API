package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, String> {
    @Query("""
    SELECT pi
    FROM ProductImage pi
    WHERE pi.product.productId = :productId
    """)
    List<ProductImage> findByProductId(String productId);

    @Query("""
    SELECT pi
    FROM ProductImage pi
    WHERE pi.product.productId = :productId
      AND pi.status = :status
""")
    List<ProductImage> findByProduct(String productId, String status);
}
