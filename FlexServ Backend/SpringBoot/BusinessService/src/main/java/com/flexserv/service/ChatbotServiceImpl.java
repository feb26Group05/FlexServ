package com.flexserv.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import com.flexserv.dto.response.ChatResponse;
import com.flexserv.entity.Service;
import com.flexserv.repository.ServiceRepository;

import lombok.RequiredArgsConstructor;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {

    private final ServiceRepository serviceRepository;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Override
    public ChatResponse getRecommendation(String userPrompt) {
        List<Service> availableServices = serviceRepository.findAll();

        if (apiKey != null && !apiKey.trim().isEmpty()) {
            // 1. Load services from MySQL Database
            StringBuilder catalogBuilder = new StringBuilder();

            if (availableServices.isEmpty()) {
                catalogBuilder.append("No active services in catalog currently.");
            } else {
                for (Service s : availableServices) {
                    catalogBuilder.append(String.format("- %s (Price: ₹%.2f): %s\n",
                            s.getName(), s.getPrice(), s.getDescription()));
                }
            }

            // 2. Build prompt context
            String systemInstruction = "You are FlexBot, an intelligent assistant for FlexServ home services.\n" +
                    "Recommend services strictly based on our available catalog below.\n" +
                    "IMPORTANT: Always format any recommended service title as a markdown link like [Service Title](/services?search=Service+Title).\n\n" +
                    catalogBuilder.toString() + "\n\n" +
                    "User Request: " + userPrompt;

            // Supported models in priority order
            String[] candidateModels = {"gemini-3.5-flash", "gemini-2.5-flash", "gemini-1.5-flash-latest"};
            WebClient webClient = WebClient.create();

            for (String modelName : candidateModels) {
                try {
                    String targetUri = UriComponentsBuilder
                            .fromHttpUrl("https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent")
                            .queryParam("key", apiKey.trim())
                            .build()
                            .toUriString();

                    Map<String, Object> requestBody = Map.of(
                        "contents", List.of(
                            Map.of(
                                "parts", List.of(
                                    Map.of("text", systemInstruction)
                                )
                            )
                        )
                    );

                    Map<?, ?> response = webClient.post()
                            .uri(targetUri)
                            .bodyValue(requestBody)
                            .retrieve()
                            .bodyToMono(Map.class)
                            .block();

                    // Parse text from response
                    if (response != null && response.containsKey("candidates")) {
                        List<?> candidates = (List<?>) response.get("candidates");
                        if (candidates != null && !candidates.isEmpty()) {
                            Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
                            Map<?, ?> content = (Map<?, ?>) candidate.get("content");
                            List<?> parts = (List<?>) content.get("parts");
                            Map<?, ?> part = (Map<?, ?>) parts.get(0);
                            String aiReply = (String) part.get("text");
                            if (aiReply != null && !aiReply.trim().isEmpty()) {
                                return new ChatResponse(aiReply.trim());
                            }
                        }
                    }
                } catch (WebClientResponseException e) {
                    System.err.println("=== GEMINI API MODEL ERROR (" + modelName + ") ===");
                    System.err.println("Status Code: " + e.getStatusCode());
                    System.err.println("Response Body: " + e.getResponseBodyAsString());
                    // Continue trying next candidate model if current one fails
                } catch (Exception e) {
                    System.err.println("=== CHATBOT GENERAL ERROR (" + modelName + ") ===");
                    e.printStackTrace();
                }
            }
        }

        // 3. Smart local catalog fallback search if Gemini API key is missing or fails
        return generateLocalRecommendation(userPrompt, availableServices);
    }

    private ChatResponse generateLocalRecommendation(String userPrompt, List<Service> availableServices) {
        if (availableServices == null || availableServices.isEmpty()) {
            return new ChatResponse("I'm sorry, there are currently no services available in our catalog.");
        }

        String query = userPrompt.toLowerCase();
        List<Service> matchedServices = availableServices.stream()
                .filter(s -> (s.getName() != null && s.getName().toLowerCase().contains(query)) ||
                             (s.getDescription() != null && s.getDescription().toLowerCase().contains(query)) ||
                             (s.getCategory() != null && s.getCategory().getName() != null && s.getCategory().getName().toLowerCase().contains(query)))
                .toList();

        // If direct match found, format recommendation
        if (!matchedServices.isEmpty()) {
            StringBuilder reply = new StringBuilder("Here are the services matching your request:\n\n");
            for (Service s : matchedServices) {
                String searchUrl = "/services?search=" + java.net.URLEncoder.encode(s.getName(), java.nio.charset.StandardCharsets.UTF_8);
                reply.append(String.format("• [%s](%s) (₹%.2f)\n  %s\n\n", s.getName(), searchUrl, s.getPrice(), s.getDescription() != null ? s.getDescription() : ""));
            }
            return new ChatResponse(reply.toString().trim());
        }

        // Partial word matching fallback
        String[] keywords = query.split("\\s+");
        List<Service> keywordMatches = availableServices.stream()
                .filter(s -> {
                    String name = s.getName() != null ? s.getName().toLowerCase() : "";
                    String desc = s.getDescription() != null ? s.getDescription().toLowerCase() : "";
                    for (String kw : keywords) {
                        if (kw.length() > 3 && (name.contains(kw) || desc.contains(kw))) {
                            return true;
                        }
                    }
                    return false;
                })
                .toList();

        if (!keywordMatches.isEmpty()) {
            StringBuilder reply = new StringBuilder("Here are some recommended services for you:\n\n");
            for (Service s : keywordMatches) {
                String searchUrl = "/services?search=" + java.net.URLEncoder.encode(s.getName(), java.nio.charset.StandardCharsets.UTF_8);
                reply.append(String.format("• [%s](%s) (₹%.2f)\n  %s\n\n", s.getName(), searchUrl, s.getPrice(), s.getDescription() != null ? s.getDescription() : ""));
            }
            return new ChatResponse(reply.toString().trim());
        }

        // Default catalog listing if no keyword match
        StringBuilder reply = new StringBuilder("I couldn't find an exact match, but here are our popular services:\n\n");
        int count = 0;
        for (Service s : availableServices) {
            String searchUrl = "/services?search=" + java.net.URLEncoder.encode(s.getName(), java.nio.charset.StandardCharsets.UTF_8);
            reply.append(String.format("• [%s](%s) (₹%.2f)\n", s.getName(), searchUrl, s.getPrice()));
            if (++count >= 5) break;
        }
        reply.append("\nFeel free to search for specific services like cleaning, plumbing, painting, or repairs!");
        return new ChatResponse(reply.toString());
    }
}