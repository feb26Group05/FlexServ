package com.flexserv.security;


import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;


@Service
public class JwtService {



    private final SecretKey key;



    public JwtService(
            @Value("${jwt.secret}") String secret
    ){

        this.key =
            Keys.hmacShaKeyFor(
                secret.getBytes()
            );

    }




    public String extractUserId(
            String token
    ){

        Claims claims =
            Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();



        return claims.getSubject();

    }




    public boolean isTokenValid(
            String token
    ){

        try{


            Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token);


            return true;


        }
        catch(Exception e){

            return false;

        }

    }

}