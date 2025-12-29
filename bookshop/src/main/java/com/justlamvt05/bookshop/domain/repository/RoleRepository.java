package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
}
