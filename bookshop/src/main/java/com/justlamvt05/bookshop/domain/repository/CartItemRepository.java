package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, String> {

    @Query("""
    SELECT ci
    FROM CartItem ci
    WHERE ci.cart.cartId = :cartId
      AND ci.product.productId = :productId
""")
    Optional<CartItem> findByCartAndProduct(
            @Param("cartId") String cartId,
            @Param("productId") String productId
    );

    @Query("""
    SELECT ci
    FROM CartItem ci
    WHERE ci.cart.cartId = :cartId
      AND ci.product.productId = :productId
""")
    Optional<CartItem> findItem(String cartId, String productId);


}
