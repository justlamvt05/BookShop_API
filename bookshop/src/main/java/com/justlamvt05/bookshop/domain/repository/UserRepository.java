package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
