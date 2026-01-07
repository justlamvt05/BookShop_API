package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {

    @Query("""
    SELECT c
    FROM Cart c
    WHERE c.user.userId = :userId
""")
    Optional<Cart> findByUser(String userId);

}
