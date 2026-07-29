package com.flexserv.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flexserv.entity.ServiceProvider;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
}
