package com.example.demo.user.service;

import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.UserProfileDTO;
import com.example.demo.user.dto.UserRegistrationDTO;

public interface UserService {
    UserDTO registerUser(UserRegistrationDTO registrationDto);
    UserProfileDTO getUser(String username);
}