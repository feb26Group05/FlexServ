package com.flexserv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flexserv.dto.request.ChatRequest;
import com.flexserv.dto.response.ChatResponse;
import com.flexserv.payload.ApiResponse;
import com.flexserv.service.ChatbotService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<ChatResponse>> getRecommendation(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatbotService.getRecommendation(request.getMessage());
        return ResponseEntity.ok(new ApiResponse<>(true, "Recommendation generated", response));
    }
}