package com.flexserv.service;

import java.util.List;

import com.flexserv.dto.request.PaymentRequest;
import com.flexserv.dto.response.PaymentResponse;

public interface PaymentService {

    PaymentResponse processPayment(PaymentRequest request);

    PaymentResponse getPaymentByBookingId(Long bookingId);

    List<PaymentResponse> getPaymentsByCustomerId(Long customerId);
}
