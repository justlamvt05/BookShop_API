package com.justlamvt05.bookshop.domain.repository;


import com.justlamvt05.bookshop.domain.dto.ProductView;
import com.justlamvt05.bookshop.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
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



    @Query(
            value = """
        SELECT 
            p.product_id        AS productId,
            p.name              AS name,
            p.description       AS description,
            p.price             AS price,
            p.quantity          AS quantity,
            c.name              AS categoryName,
            i.url               AS imageUrl
        FROM TBL_PRODUCT p
        JOIN TBL_CATEGORY c
            ON p.category_id = c.category_id
        LEFT JOIN TBL_PRODUCT_IMAGE i
            ON p.product_id = i.product_id
           AND i.is_main = 1
           AND i.status = 'ACTIVE'
        WHERE p.status = 'ACTIVE'
          AND (:categoryId IS NULL OR p.category_id = :categoryId)
          AND (:keyword IS NULL OR p.name LIKE CONCAT('%', :keyword, '%'))
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        ORDER BY
          CASE WHEN :sortBy = 'price_asc'  THEN p.price END ASC,
          CASE WHEN :sortBy = 'price_desc' THEN p.price END DESC,
          CASE WHEN :sortBy = 'name_asc'   THEN p.name  END ASC,
          CASE WHEN :sortBy = 'name_desc'  THEN p.name  END DESC
        """,
            countQuery = """
        SELECT COUNT(DISTINCT p.product_id)
        FROM TBL_PRODUCT p
        WHERE p.status = 'ACTIVE'
          AND (:categoryId IS NULL OR p.category_id = :categoryId)
          AND (:keyword IS NULL OR p.name LIKE CONCAT('%', :keyword, '%'))
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        """,
            nativeQuery = true
    )
    Page<ProductView> searchProducts(
            @Param("categoryId") String categoryId,
            @Param("keyword") String keyword,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("sortBy") String sortBy,
            Pageable pageable
    );

}

