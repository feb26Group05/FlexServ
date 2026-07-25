package com.flexserv.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flexserv.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}