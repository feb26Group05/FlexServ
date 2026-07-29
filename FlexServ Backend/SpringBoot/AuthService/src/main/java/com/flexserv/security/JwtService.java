package com.flexserv.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.flexserv.entity.Admin;
import com.flexserv.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Generate JWT for User
     */
    public String generateToken(User user) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("role", user.getRole().name());

        return buildToken(claims, user);
    }

    /**
     * Generate JWT for Admin
     */
    public String generateToken(Admin admin) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("role", admin.getRole().name());

        return buildTokenForAdmin(claims, admin);
    }

    /**
     * Internal method to build token for Admin
     */
    private String buildTokenForAdmin(Map<String, Object> extraClaims, Admin admin) {

        return Jwts.builder()

                .claims(extraClaims)

                .subject(String.valueOf(admin.getId()))

                .issuedAt(new Date())

                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))

                .signWith(getSigningKey())

                .compact();
    }

    /**
     * Internal method to build token
     */

    private String buildToken(Map<String, Object> extraClaims, User user) {

        return Jwts.builder()

                .claims(extraClaims)

                // userId becomes JWT Subject
                .subject(String.valueOf(user.getId()))

                .issuedAt(new Date())

                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))

                .signWith(getSigningKey())

                .compact();
    }

    /**
     * Validate Token
     */
    public boolean isTokenValid(String token, User user) {

        String userId = extractUserId(token);

        return userId.equals(String.valueOf(user.getId()))
                && !isTokenExpired(token);
    }

    /**
     * Extract User Id
     */
    public String extractUserId(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract Role
     */
    public String extractRole(String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }

    /**
     * Extract Expiration
     */
    public Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generic Claim Extractor
     */
    public <T> T extractClaim(
            String token,
            Function<Claims, T> resolver) {

        Claims claims = extractAllClaims(token);

        return resolver.apply(claims);
    }

    /**
     * Check Expiration
     */
    private boolean isTokenExpired(String token) {

        return extractExpiration(token)
                .before(new Date());
    }

    /**
     * Read JWT Claims
     */
    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                .verifyWith(getSigningKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }

    /**
     * Secret Key
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }


}