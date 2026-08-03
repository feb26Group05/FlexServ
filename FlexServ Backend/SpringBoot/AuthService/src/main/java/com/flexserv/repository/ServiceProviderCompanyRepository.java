package com.flexserv.repository;

import com.flexserv.entity.ServiceProviderCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceProviderCompanyRepository extends JpaRepository<ServiceProviderCompany, Long> {
    
    Optional<ServiceProviderCompany> findByUserId(Long userId);
    
    List<ServiceProviderCompany> findByCompanyAvailableTrue();

    // Filter providers offering services in a specific Category
    List<ServiceProviderCompany> findByServices_Category_Id(Long categoryId);

    // Search by Company Name or Bio
    @Query("SELECT DISTINCT p FROM ServiceProviderCompany p WHERE " +
           "LOWER(p.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.bio) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ServiceProviderCompany> searchProviders(@Param("keyword") String keyword);
}