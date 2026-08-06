package com.flexserv.service;

import java.util.List;

import com.flexserv.dto.request.BookingCreateRequest;
import com.flexserv.dto.request.BookingStatusUpdateRequest;
import com.flexserv.dto.response.BookingResponse;

public interface TransactionService {
    // Service Booking Cycle Methods
    BookingResponse createBooking(BookingCreateRequest request);
    BookingResponse getBookingById(Long id);
    List<BookingResponse> getAllBookings();
    List<BookingResponse> getBookingsByCustomer(Long customerId);
    List<BookingResponse> getBookingsByProvider(Long providerId);
    List<BookingResponse> getBookingsByStatus(String status);
    
    // Status Transitions
    BookingResponse updateBookingStatus(Long bookingId, BookingStatusUpdateRequest request);
    BookingResponse confirmBooking(Long bookingId);
    BookingResponse startBookingService(Long bookingId);
    BookingResponse completeBooking(Long bookingId);
    BookingResponse cancelBooking(Long bookingId, String reason);
    BookingResponse rejectBooking(Long bookingId, String reason);
}
