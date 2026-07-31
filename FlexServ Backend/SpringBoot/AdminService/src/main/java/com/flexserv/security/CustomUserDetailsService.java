package com.flexserv.security;


import org.springframework.stereotype.Service;

import com.flexserv.entity.User;
import com.flexserv.repository.UserRepository;


import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class CustomUserDetailsService {



    private final UserRepository userRepository;




    public CustomUserDetails loadUserById(
            Long id
    ){


        User user =
            userRepository.findById(id)

            .orElseThrow(
                () ->
                new RuntimeException(
                    "User not found"
                )
            );


        return new CustomUserDetails(user);

    }

}