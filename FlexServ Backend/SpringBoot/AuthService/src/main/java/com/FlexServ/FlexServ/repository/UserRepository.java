package com.FlexServ.FlexServ.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.FlexServ.FlexServ.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}