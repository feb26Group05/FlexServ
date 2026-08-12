package com.flexserv.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flexserv.dto.request.ReviewRequest;
import com.flexserv.dto.response.ReviewResponse;
import com.flexserv.entity.Booking;
import com.flexserv.entity.Review;
import com.flexserv.entity.ServiceProvider;
import com.flexserv.exception.ResourceNotFoundException;
import com.flexserv.repository.BookingRepository;
import com.flexserv.repository.ReviewRepository;
import com.flexserv.repository.ServiceProviderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final ServiceProviderRepository serviceProviderRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId()));

        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalArgumentException("Reviews can only be submitted for COMPLETED bookings.");
        }

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new IllegalArgumentException("A review has already been submitted for this booking.");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setCustomer(booking.getCustomer());
        review.setProvider(booking.getProvider());
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);

        // Recalculate average rating for service provider
        Double avgRating = reviewRepository.findAverageRatingByProviderId(booking.getProvider().getId());
        if (avgRating != null) {
            BigDecimal ratingValue = BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP);
            booking.getProvider().setRating(ratingValue);
            serviceProviderRepository.save(booking.getProvider());
        }

        return mapToResponse(saved);
    }

    @Override
    public ReviewResponse getReviewByBookingId(Long bookingId) {
        Review review = reviewRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found for Booking ID: " + bookingId));
        return mapToResponse(review);
    }

    @Override
    public List<ReviewResponse> getReviewsByProviderId(Long providerId) {
        return reviewRepository.findByProviderId(providerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByCustomerId(Long customerId) {
        return reviewRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + id));

        Long providerId = review.getProvider() != null ? review.getProvider().getId() : null;
        ServiceProvider provider = review.getProvider();

        reviewRepository.delete(review);

        // Recalculate average rating for service provider after review deletion
        if (providerId != null && provider != null) {
            Double avgRating = reviewRepository.findAverageRatingByProviderId(providerId);
            if (avgRating != null) {
                BigDecimal ratingValue = BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP);
                provider.setRating(ratingValue);
            } else {
                provider.setRating(BigDecimal.valueOf(5.0));
            }
            serviceProviderRepository.save(provider);
        }
    }

    private ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getBooking() != null ? review.getBooking().getId() : null,
                review.getCustomer() != null ? review.getCustomer().getId() : null,
                review.getCustomer() != null ? review.getCustomer().getName() : "",
                review.getProvider() != null ? review.getProvider().getId() : null,
                review.getProvider() != null ? review.getProvider().getCompanyName() : "",
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
