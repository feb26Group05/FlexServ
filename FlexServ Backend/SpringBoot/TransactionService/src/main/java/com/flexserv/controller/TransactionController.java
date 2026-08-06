package com.flexserv.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flexserv.dto.request.BookingCreateRequest;
import com.flexserv.dto.request.BookingStatusUpdateRequest;
import com.flexserv.dto.response.BookingResponse;
import com.flexserv.payload.ApiResponse;
import com.flexserv.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TransactionController {

    private final TransactionService transactionService;

    // 1. Create Booking Request (Status: PENDING)
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingCreateRequest request) {
        BookingResponse booking = transactionService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Booking Requested Successfully", booking));
    }

    // 2. Get Booking Details By ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse booking = transactionService.getBookingById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking Retrieved Successfully", booking));
    }

    // 3. Get All Bookings
    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> bookings = transactionService.getAllBookings();
        return ResponseEntity.ok(new ApiResponse<>(true, "All Bookings Retrieved Successfully", bookings));
    }

    // 4. Get Customer Bookings
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByCustomer(@PathVariable Long customerId) {
        List<BookingResponse> bookings = transactionService.getBookingsByCustomer(customerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Customer Bookings Retrieved Successfully", bookings));
    }

    // 5. Get Provider Bookings
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByProvider(@PathVariable Long providerId) {
        List<BookingResponse> bookings = transactionService.getBookingsByProvider(providerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Provider Bookings Retrieved Successfully", bookings));
    }

    // 6. Get Bookings By Status (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED)
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByStatus(@PathVariable String status) {
        List<BookingResponse> bookings = transactionService.getBookingsByStatus(status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings Retrieved By Status Successfully", bookings));
    }

    // 7. General Status Transition Endpoint
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        BookingResponse booking = transactionService.updateBookingStatus(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking Status Updated to " + booking.getStatus(), booking));
    }

    // 8. Confirm Booking (PENDING -> CONFIRMED)
    @PutMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<BookingResponse>> confirmBooking(@PathVariable Long id) {
        BookingResponse booking = transactionService.confirmBooking(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking Confirmed Successfully", booking));
    }

    // 9. Start Booking Service (CONFIRMED -> IN_PROGRESS)
    @PutMapping("/{id}/start")
    public ResponseEntity<ApiResponse<BookingResponse>> startBooking(@PathVariable Long id) {
        BookingResponse booking = transactionService.startBookingService(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking Service Started (IN_PROGRESS)", booking));
    }

    // 10. Complete Booking (IN_PROGRESS -> COMPLETED)
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<BookingResponse>> completeBooking(@PathVariable Long id) {
        BookingResponse booking = transactionService.completeBooking(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking Completed Successfully", booking));
    }

    // 11. Cancel Booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Cancelled by user") String reason) {
        BookingResponse booking = transactionService.cancelBooking(id, reason);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking Cancelled Successfully", booking));
    }

    // 12. Reject Booking Request
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<BookingResponse>> rejectBooking(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Rejected by provider") String reason) {
        BookingResponse booking = transactionService.rejectBooking(id, reason);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking Request Rejected", booking));
    }
}
