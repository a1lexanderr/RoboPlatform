package com.example.demo.security.service;

public interface SecurityService {
    void checkTeamCaptainAccess(Long teamId, Long userId);
}
