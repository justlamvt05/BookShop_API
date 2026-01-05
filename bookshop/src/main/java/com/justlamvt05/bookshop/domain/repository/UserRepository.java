package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserName(String username);
}
