package com.flexserv.service;

import java.util.List;

import com.flexserv.dto.request.ReviewRequest;
import com.flexserv.dto.response.ReviewResponse;

public interface ReviewService {

    ReviewResponse createReview(ReviewRequest request);

    ReviewResponse getReviewByBookingId(Long bookingId);

    List<ReviewResponse> getReviewsByProviderId(Long providerId);

    List<ReviewResponse> getReviewsByCustomerId(Long customerId);

    List<ReviewResponse> getAllReviews();

    void deleteReview(Long id);
}
