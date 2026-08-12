package com.flexserv.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.flexserv.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByProviderId(Long providerId);
}
