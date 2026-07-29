package com.flexserv.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flexserv.entity.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Optional<Admin> findByEmail(String email);
}
