package com.flexserv.security;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.reactive.CorsUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            WebFilterChain chain) {

        // 1. Skip preflight OPTIONS requests
        if (CorsUtils.isPreFlightRequest(exchange.getRequest())) {
            return chain.filter(exchange);
        }

        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        // 2. Allow login/register/logout & public AI chatbot recommendations
        if (path.startsWith("/api/auth") || path.startsWith("/api/chat")) {
            return chain.filter(exchange);
        }

        // 3. Allow GET for public services and categories
        if (HttpMethod.GET.equals(method) && (path.startsWith("/api/admin/services") || path.startsWith("/api/admin/categories"))) {
            return chain.filter(exchange);
        }

        // 4. Extract token from Authorization header or JWT cookie
        String token = null;

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            var cookie = exchange.getRequest().getCookies().getFirst("JWT");
            if (cookie == null) {
                cookie = exchange.getRequest().getCookies().getFirst("jwtToken");
            }
            if (cookie != null) {
                token = cookie.getValue();
            }
        }

        // 5. Validate token
        if (token == null || !jwtService.isTokenValid(token)) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            if (!response.getHeaders().containsKey(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN)) {
                response.getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173");
                response.getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
                response.getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "*");
                response.getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, PUT, DELETE, OPTIONS");
            }
            return response.setComplete();
        }

        // 6. Valid JWT: Attach user details headers and forward downstream
        String userId = jwtService.extractUserId(token);
        String role = jwtService.extractRole(token);

        var requestBuilder = exchange.getRequest().mutate();
        if (userId != null) {
            requestBuilder.header("X-User-Id", userId);
        }
        if (role != null) {
            requestBuilder.header("X-User-Role", role);
        }

        return chain.filter(exchange.mutate().request(requestBuilder.build()).build());
    }
}
