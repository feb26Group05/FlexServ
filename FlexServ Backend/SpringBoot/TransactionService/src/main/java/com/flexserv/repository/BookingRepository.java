package com.flexserv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flexserv.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByProviderId(Long providerId);
    List<Booking> findByStatus(String status);
    List<Booking> findByCustomerIdAndStatus(Long customerId, String status);
    List<Booking> findByProviderIdAndStatus(Long providerId, String status);
}
