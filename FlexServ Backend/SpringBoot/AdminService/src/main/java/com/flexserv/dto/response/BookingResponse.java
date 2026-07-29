package com.flexserv.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;

    private Long customerId;

    private String customerName;

    private String customerEmail;

    private Long providerId;

    private String providerCompanyName;

    private Long serviceId;

    private String serviceName;

    private LocalDate bookingDate;

    private LocalTime bookingTime;

    private String status;

    private BigDecimal totalPrice;

    private Boolean isActive;

    private LocalDateTime createdAt;
}
