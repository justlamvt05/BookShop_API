package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
        select distinct o
        from Order o
        left join fetch o.orderItems oi
        left join fetch oi.product
        where o.user.userId = :userId
    """)
    List<Order> findByUser_UserId(String userId);



}
