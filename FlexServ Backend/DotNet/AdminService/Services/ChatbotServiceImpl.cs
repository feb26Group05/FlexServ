using AdminService.Data;
using AdminService.Dtos;
using AdminService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AdminService.Services
{
    public class ChatbotServiceImpl : IChatbotService
    {
        private readonly AdminDbContext _dbContext;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ChatbotServiceImpl> _logger;

        public ChatbotServiceImpl(
            AdminDbContext dbContext,
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<ChatbotServiceImpl> logger)
        {
            _dbContext = dbContext;
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<ChatResponse> GetRecommendationAsync(string userPrompt)
        {
            var availableServices = await _dbContext.Services
                .Include(s => s.Category)
                .ToListAsync();

            var apiKey = _configuration["GEMINI_API_KEY"] 
                         ?? _configuration["gemini:api:key"] 
                         ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");

            if (!string.IsNullOrWhiteSpace(apiKey))
            {
                var catalogBuilder = new StringBuilder();
                if (availableServices.Count == 0)
                {
                    catalogBuilder.Append("No active services in catalog currently.");
                }
                else
                {
                    foreach (var s in availableServices)
                    {
                        catalogBuilder.AppendLine($"- {s.Name} (Price: ₹{s.Price:F2}): {s.Description}");
                    }
                }

                var systemInstruction = "You are FlexBot, an intelligent assistant for FlexServ home services.\n" +
                    "Recommend services strictly based on our available catalog below.\n" +
                    "IMPORTANT: Always format any recommended service title as a markdown link like [Service Title](/services?search=Service+Title).\n\n" +
                    catalogBuilder.ToString() + "\n\n" +
                    "User Request: " + userPrompt;

                var candidateModels = new[] { "gemini-2.0-flash", "gemini-1.5-flash" };

                foreach (var modelName in candidateModels)
                {
                    try
                    {
                        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={apiKey.Trim()}";

                        var requestBody = new
                        {
                            contents = new[]
                            {
                                new
                                {
                                    parts = new[]
                                    {
                                        new { text = systemInstruction }
                                    }
                                }
                            }
                        };

                        var response = await _httpClient.PostAsJsonAsync(url, requestBody);
                        if (response.IsSuccessStatusCode)
                        {
                            var jsonResponse = await response.Content.ReadAsStringAsync();
                            using var doc = JsonDocument.Parse(jsonResponse);
                            var candidates = doc.RootElement.GetProperty("candidates");
                            if (candidates.GetArrayLength() > 0)
                            {
                                var aiReply = candidates[0]
                                    .GetProperty("content")
                                    .GetProperty("parts")[0]
                                    .GetProperty("text")
                                    .GetString();

                                if (!string.IsNullOrWhiteSpace(aiReply))
                                {
                                    return new ChatResponse(aiReply.Trim());
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning("Gemini API call ({Model}) failed: {Message}", modelName, ex.Message);
                    }
                }
            }

            return GenerateLocalRecommendation(userPrompt, availableServices);
        }

        private static ChatResponse GenerateLocalRecommendation(string userPrompt, List<Service> availableServices)
        {
            if (availableServices == null || availableServices.Count == 0)
            {
                return new ChatResponse("I'm sorry, there are currently no services available in our catalog.");
            }

            var query = (userPrompt ?? "").ToLower();

            var matchedServices = availableServices
                .Where(s => (s.Name != null && s.Name.ToLower().Contains(query)) ||
                            (s.Description != null && s.Description.ToLower().Contains(query)) ||
                            (s.Category != null && s.Category.Name != null && s.Category.Name.ToLower().Contains(query)))
                .ToList();

            if (matchedServices.Count > 0)
            {
                var reply = new StringBuilder("Here are the services matching your request:\n\n");
                foreach (var s in matchedServices)
                {
                    var searchUrl = "/services?search=" + Uri.EscapeDataString(s.Name ?? "");
                    reply.AppendLine($"• [{s.Name}]({searchUrl}) (₹{s.Price:F2})\n  {s.Description}\n");
                }
                return new ChatResponse(reply.ToString().Trim());
            }

            var keywords = query.Split(new[] { ' ', '\t', '\n', ',', '.' }, StringSplitOptions.RemoveEmptyEntries);
            var keywordMatches = availableServices
                .Where(s =>
                {
                    var name = s.Name?.ToLower() ?? "";
                    var desc = s.Description?.ToLower() ?? "";
                    return keywords.Any(kw => kw.Length > 3 && (name.Contains(kw) || desc.Contains(kw)));
                })
                .ToList();

            if (keywordMatches.Count > 0)
            {
                var reply = new StringBuilder("Here are some recommended services for you:\n\n");
                foreach (var s in keywordMatches)
                {
                    var searchUrl = "/services?search=" + Uri.EscapeDataString(s.Name ?? "");
                    reply.AppendLine($"• [{s.Name}]({searchUrl}) (₹{s.Price:F2})\n  {s.Description}\n");
                }
                return new ChatResponse(reply.ToString().Trim());
            }

            var defaultReply = new StringBuilder("I couldn't find an exact match, but here are our popular services:\n\n");
            int count = 0;
            foreach (var s in availableServices)
            {
                var searchUrl = "/services?search=" + Uri.EscapeDataString(s.Name ?? "");
                defaultReply.AppendLine($"• [{s.Name}]({searchUrl}) (₹{s.Price:F2})");
                if (++count >= 5) break;
            }
            defaultReply.AppendLine("\nFeel free to search for specific services like cleaning, plumbing, painting, or repairs!");
            return new ChatResponse(defaultReply.ToString().Trim());
        }
    }
}
