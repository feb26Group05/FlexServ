package com.flexserv.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.flexserv.entity.ServiceProviderCompany;

@Repository
public interface ServiceProviderCompanyRepository extends JpaRepository<ServiceProviderCompany, Long> {

    Optional<ServiceProviderCompany> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}