package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
}
