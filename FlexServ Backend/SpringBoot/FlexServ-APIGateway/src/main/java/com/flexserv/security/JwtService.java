package com.flexserv.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final String SECRET = "7Q9xL8p2WvN4zRf6Kj1YmA8Ds3GhP5TbXc9Mn2Qa";

	private SecretKey getSigningKey() {

		return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
	}

	public Claims extractClaims(String token) {

		return Jwts.parser()

				.verifyWith(getSigningKey())

				.build()

				.parseSignedClaims(token)

				.getPayload();
	}

	public boolean isTokenValid(String token) {

		try {

			Claims claims = extractClaims(token);

			Date expiration = claims.getExpiration();

			return expiration != null && expiration.after(new Date());

		} catch (Exception e) {

			return false;
		}
	}

	public String extractUserId(String token) {

		return extractClaims(token).getSubject();
	}

	public String extractRole(String token) {
		try {
			Claims claims = extractClaims(token);
			return claims.get("role", String.class);
		} catch (Exception e) {
			return null;
		}
	}
}