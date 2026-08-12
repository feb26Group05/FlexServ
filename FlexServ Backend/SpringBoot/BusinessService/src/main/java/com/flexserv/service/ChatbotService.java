package com.flexserv.service;

import com.flexserv.dto.response.ChatResponse;

public interface ChatbotService {
    ChatResponse getRecommendation(String userPrompt);
}