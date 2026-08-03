package com.flexserv.security;


import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import lombok.RequiredArgsConstructor;



@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter 
        extends OncePerRequestFilter {



    private final JwtService jwtService;

    private final CustomUserDetailsService userDetailsService;



    @Override
    protected void doFilterInternal(

            @NonNull HttpServletRequest request,

            @NonNull HttpServletResponse response,

            @NonNull FilterChain filterChain

    )

    throws ServletException, IOException {



        String token = null;



        Cookie[] cookies =
                request.getCookies();



        if(cookies != null){


            for(Cookie cookie : cookies){


                if(cookie.getName()
                        .equals("JWT")){


                    token =
                        cookie.getValue();


                    break;

                }

            }

        }



        if(token == null){


            filterChain.doFilter(
                    request,
                    response
            );

            return;

        }





        String userId =
                jwtService.extractUserId(token);



        if(userId != null &&

           SecurityContextHolder
           .getContext()
           .getAuthentication()
           == null){



            UserDetails userDetails =
                    userDetailsService
                    .loadUserById(
                        Long.parseLong(userId)
                    );



            if(jwtService.isTokenValid(token)){



                UsernamePasswordAuthenticationToken authentication =

                    new UsernamePasswordAuthenticationToken(

                        userDetails,

                        null,

                        userDetails.getAuthorities()

                    );



                authentication.setDetails(

                    new WebAuthenticationDetailsSource()
                    .buildDetails(request)

                );



                SecurityContextHolder
                .getContext()
                .setAuthentication(authentication);


            }

        }



        filterChain.doFilter(
                request,
                response
        );

    }

}