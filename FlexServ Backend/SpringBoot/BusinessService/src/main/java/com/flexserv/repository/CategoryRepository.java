package com.flexserv.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flexserv.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
