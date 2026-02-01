package com.example.demo.user.service;

import com.example.demo.common.dto.ImageDTO;
import com.example.demo.common.exception.business.BusinessException;
import com.example.demo.common.exception.business.user.UserNotFoundException;
import com.example.demo.user.domain.User;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.UserProfileDTO;
import com.example.demo.user.dto.UserRegistrationDTO;
import com.example.demo.user.mapper.UserMapper;
import com.example.demo.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }
    @Override
    public UserDTO registerUser(UserRegistrationDTO userDTO) {
        Map<String, String> errors = new HashMap<>();
        if(userRepository.existsByUsername(userDTO.username())){
            errors.put("username", "Username is already in use");
        }
        if(userRepository.existsByEmail(userDTO.email())){
            errors.put("email", "Email is already in use");
        }
        if(userRepository.existsByPhoneNumber(userDTO.phoneNumber())){
            errors.put("phoneNumber", "Phone number is already in use");
        }

        if(!errors.isEmpty()){
            throw new BusinessException(
                    "User validation failed",
                    HttpStatus.BAD_REQUEST,
                    errors
            );
        }

        User user = userMapper.toEntity(userDTO);
        user.setPasswordHash(passwordEncoder.encode(userDTO.password()));



        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public UserProfileDTO getUser(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        ImageDTO imageDTO = null;
        if (user.getImage() != null) {
            imageDTO = new ImageDTO(
                    user.getImage().getId(),
                    user.getImage().getTitle(),
                    user.getImage().getUrl()
            );
        }

        return new UserProfileDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                imageDTO,
                user.getRoles()
        );
    }



}
