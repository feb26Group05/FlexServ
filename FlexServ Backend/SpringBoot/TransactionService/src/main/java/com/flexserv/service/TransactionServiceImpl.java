package com.flexserv.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flexserv.dto.request.BookingCreateRequest;
import com.flexserv.dto.request.BookingStatusUpdateRequest;
import com.flexserv.dto.response.BookingResponse;
import com.flexserv.entity.Address;
import com.flexserv.entity.Booking;
import com.flexserv.entity.BookingStatus;
import com.flexserv.entity.ServiceProvider;
import com.flexserv.entity.User;
import com.flexserv.exception.InvalidBookingStatusException;
import com.flexserv.exception.ResourceNotFoundException;
import com.flexserv.repository.AddressRepository;
import com.flexserv.repository.BookingRepository;
import com.flexserv.repository.ServiceProviderRepository;
import com.flexserv.repository.ServiceRepository;
import com.flexserv.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceRepository serviceRepository;
    private final AddressRepository addressRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        ServiceProvider provider = serviceProviderRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found with ID: " + request.getProviderId()));

        com.flexserv.entity.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + request.getServiceId()));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + request.getAddressId()));

        BigDecimal price = (request.getTotalPrice() != null) ? request.getTotalPrice() : service.getPrice();

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setProvider(provider);
        booking.setService(service);
        booking.setAddress(address);
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setTotalPrice(price);
        booking.setStatus(BookingStatus.PENDING.name()); // Lifecycle start: PENDING

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        return mapToResponse(booking);
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getBookingsByProvider(Long providerId) {
        return bookingRepository.findByProviderId(providerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status.toUpperCase()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatusUpdateRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        String targetStatusStr = request.getStatus().toUpperCase();

        if (!BookingStatus.isValidStatus(targetStatusStr)) {
            throw new InvalidBookingStatusException("Invalid status: " + request.getStatus() + ". Allowed: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED");
        }

        validateStateTransition(booking.getStatus(), targetStatusStr);

        booking.setStatus(targetStatusStr);
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    @Override
    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        return transitionStatus(bookingId, BookingStatus.CONFIRMED.name());
    }

    @Override
    @Transactional
    public BookingResponse startBookingService(Long bookingId) {
        return transitionStatus(bookingId, BookingStatus.IN_PROGRESS.name());
    }

    @Override
    @Transactional
    public BookingResponse completeBooking(Long bookingId) {
        return transitionStatus(bookingId, BookingStatus.COMPLETED.name());
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String reason) {
        return transitionStatus(bookingId, BookingStatus.CANCELLED.name());
    }

    @Override
    @Transactional
    public BookingResponse rejectBooking(Long bookingId, String reason) {
        return transitionStatus(bookingId, BookingStatus.REJECTED.name());
    }

    private BookingResponse transitionStatus(Long bookingId, String targetStatusStr) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        validateStateTransition(booking.getStatus(), targetStatusStr);
        booking.setStatus(targetStatusStr);
        return mapToResponse(bookingRepository.save(booking));
    }

    private void validateStateTransition(String currentStatus, String newStatus) {
        if (currentStatus == null) return;
        String current = currentStatus.toUpperCase();

        if (current.equals(newStatus)) return; // No change

        if (current.equals("COMPLETED") || current.equals("CANCELLED") || current.equals("REJECTED")) {
            throw new InvalidBookingStatusException("Cannot transition terminal booking status '" + current + "' to '" + newStatus + "'");
        }
    }

    private BookingResponse mapToResponse(Booking booking) {
        String addressDetails = (booking.getAddress() != null)
                ? String.format("%s, %s, %s %s",
                booking.getAddress().getStreetAddress(),
                booking.getAddress().getCity(),
                booking.getAddress().getState(),
                booking.getAddress().getZipCode())
                : "";

        return new BookingResponse(
                booking.getId(),
                booking.getCustomer() != null ? booking.getCustomer().getId() : null,
                booking.getCustomer() != null ? booking.getCustomer().getName() : "",
                booking.getCustomer() != null ? booking.getCustomer().getEmail() : "",
                booking.getProvider() != null ? booking.getProvider().getId() : null,
                booking.getProvider() != null ? booking.getProvider().getCompanyName() : "",
                booking.getService() != null ? booking.getService().getId() : null,
                booking.getService() != null ? booking.getService().getName() : "",
                booking.getAddress() != null ? booking.getAddress().getId() : null,
                addressDetails,
                booking.getBookingDate(),
                booking.getBookingTime(),
                booking.getStatus(),
                booking.getTotalPrice(),
                booking.getCreatedAt()
        );
    }
}
