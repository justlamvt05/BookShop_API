package com.justlamvt05.bookshop.domain.repository;


import com.justlamvt05.bookshop.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {

    @Query("""
        SELECT p FROM Product p
        WHERE (:keyword IS NULL 
              OR p.productId LIKE %:keyword%
              OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:status IS NULL OR p.status = :status)
    """)
    Page<Product> search(
            @Param("keyword") String keyword,
            @Param("status") String status,
            Pageable pageable
    );

    boolean existsByNameIgnoreCase(String name);

    @Query(value = "SELECT NEXT VALUE FOR SEQ_PRODUCT_ID", nativeQuery = true)
    Long getNextProductSeq();

    @Query("""
        SELECT p FROM Product p
        WHERE p.status = 'ACTIVE'
        AND (:keyword IS NULL OR p.name LIKE %:keyword%)
        AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
    """)
    Page<Product> searchProduct(
            Pageable pageable,
            @Param("keyword") String keyword,
            @Param("categoryId") String categoryId
    );

    @Query("""
        SELECT p FROM Product p
        WHERE p.status = 'ACTIVE'
        AND p.productId = :productId
    """)
    Optional<Product> findActiveById(String productId);
}

