package com.flexserv.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flexserv.entity.Service;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
}
