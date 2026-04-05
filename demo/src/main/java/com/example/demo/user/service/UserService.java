package com.example.demo.user.service;

import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.UserProfileDTO;
import com.example.demo.user.dto.UserRegistrationDTO;
import com.example.demo.user.dto.UserUpdateDTO;

public interface UserService {
    UserDTO registerUser(UserRegistrationDTO registrationDto);
    UserProfileDTO getUser(String username);
    UserProfileDTO updateProfile(String username, UserUpdateDTO updateDto);
}