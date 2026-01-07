package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByUser_UserId(String userId);
}
