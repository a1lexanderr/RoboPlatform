package com.example.demo.security.service;

import com.example.demo.common.exception.business.BusinessException;
import com.example.demo.security.dto.AuthResponse;
import com.example.demo.security.dto.LoginRequestDTO;
import com.example.demo.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public AuthResponse login(LoginRequestDTO loginRequest) {
        try {
            log.info("Attempting authentication for user: {}", loginRequest.usernameOrEmail());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.usernameOrEmail(),
                            loginRequest.password()
                    )
            );

            log.info("Authentication successful for user: {}", loginRequest.usernameOrEmail());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            log.info("Retrieved user details: {}", userDetails.getUsername());

            try {
                String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
                log.info("Access token generated successfully");
                String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);
                log.info("Refresh token generated successfully");

                return new AuthResponse(accessToken, refreshToken, userDetails.getUsername());
            } catch (Exception e) {
                log.error("Error generating tokens", e);
                throw e;
            }
        }
        catch (BadCredentialsException e) {
            Map<String, String> details = new HashMap<>();
            details.put("error", "Invalid username/email or password");
            throw new BusinessException("Authentication error", HttpStatus.UNAUTHORIZED, details);
        }
        catch (Exception e) {
            log.error("Unexpected error during authentication", e);
            throw e;
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

        if (jwtTokenProvider.validateToken(refreshToken, userDetails)) {
            String newAccessToken = jwtTokenProvider.generateAccessToken(userDetails);
            String newRefreshToken = jwtTokenProvider.generateRefreshToken(userDetails);
            return new AuthResponse(newAccessToken, newRefreshToken, username);
        }

        throw new BusinessException(
                "Invalid refresh token",
                HttpStatus.UNAUTHORIZED,
                Map.of("refreshToken", "Token is invalid or expired")
        );
    }


}
