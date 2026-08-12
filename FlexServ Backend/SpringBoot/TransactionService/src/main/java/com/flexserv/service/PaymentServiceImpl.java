package com.flexserv.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flexserv.dto.request.PaymentRequest;
import com.flexserv.dto.response.PaymentResponse;
import com.flexserv.entity.Booking;
import com.flexserv.entity.Payment;
import com.flexserv.exception.ResourceNotFoundException;
import com.flexserv.repository.BookingRepository;
import com.flexserv.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId()));

        String method = request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "CASH";
        if (!method.equals("CASH") && !method.equals("CARD") && !method.equals("UPI")) {
            throw new IllegalArgumentException("Invalid payment method. Allowed methods: CASH, CARD, UPI");
        }

        // Check if payment already exists for this booking
        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElse(new Payment());

        payment.setBooking(booking);
        payment.setAmount(request.getAmount() != null ? request.getAmount() : booking.getTotalPrice());
        payment.setPaymentMethod(method);
        payment.setPaymentStatus("SUCCESS");

        String prefix = method.equals("CASH") ? "CASH-TXN-" : method.equals("CARD") ? "CARD-TXN-" : "UPI-TXN-";
        payment.setTransactionId(prefix + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    @Override
    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for Booking ID: " + bookingId));
        return mapToResponse(payment);
    }

    @Override
    public List<PaymentResponse> getPaymentsByCustomerId(Long customerId) {
        return paymentRepository.findByBookingCustomerId(customerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getBooking() != null ? payment.getBooking().getId() : null,
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getTransactionId(),
                payment.getCreatedAt()
        );
    }
}
