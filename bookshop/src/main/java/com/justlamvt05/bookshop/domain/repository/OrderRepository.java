package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.Order;
import com.justlamvt05.bookshop.domain.entity.constraint.EPaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("""
        select o
        from Order o
         WHERE
    (:keyword IS NULL OR
        LOWER(o.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(o.user.userName) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
    AND (:status IS NULL OR o.paymentStatus = :status)
    """)
    Page<Order> findAllOrders(Pageable pageable, String keyword, EPaymentStatus status);

}
