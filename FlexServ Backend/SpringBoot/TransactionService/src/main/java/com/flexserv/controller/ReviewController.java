package com.flexserv.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flexserv.dto.request.ReviewRequest;
import com.flexserv.dto.response.ReviewResponse;
import com.flexserv.payload.ApiResponse;
import com.flexserv.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Review submitted successfully", response));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewByBookingId(@PathVariable Long bookingId) {
        ReviewResponse response = reviewService.getReviewByBookingId(bookingId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking review fetched successfully", response));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByProviderId(@PathVariable Long providerId) {
        List<ReviewResponse> response = reviewService.getReviewsByProviderId(providerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Provider reviews fetched successfully", response));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByCustomerId(@PathVariable Long customerId) {
        List<ReviewResponse> response = reviewService.getReviewsByCustomerId(customerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Customer reviews fetched successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        List<ReviewResponse> response = reviewService.getAllReviews();
        return ResponseEntity.ok(new ApiResponse<>(true, "All reviews fetched successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Review deleted successfully", "Review with ID " + id + " has been deleted."));
    }
}
