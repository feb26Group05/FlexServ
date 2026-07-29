package com.flexserv.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flexserv.entity.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
}
