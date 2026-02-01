package com.example.demo.application.service;

import com.example.demo.application.domain.ApplicationStatus;
import com.example.demo.application.dto.*;
import com.example.demo.security.model.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ApplicationFormService {
    ApplicationFormResponseDTO createApplication(ApplicationFormCreateDTO createDTO, UserPrincipal currentUser);
    ApplicationFormResponseDTO getApplicationById(Long applicationId);
    ApplicationFormResponseDTO updateApplication(Long applicationId, ApplicationFormUpdateDTO updateDTO, UserPrincipal currentUser);
    ApplicationFormResponseDTO reviewApplication(Long applicationId, ApplicationFormReviewDTO reviewDTO, UserPrincipal currentUser);
    void deleteApplication(Long applicationId, UserPrincipal currentUser);
    Page<ApplicationFormSummaryDTO> getApplicationsForUser(UserPrincipal currentUser, Pageable pageable);
    Page<ApplicationFormResponseDTO> getApplicationsForCompetition(Long competitionId, Pageable pageable);
    Page<ApplicationFormResponseDTO> getAllApplicationsWithFilters(ApplicationStatus status, Long competitionId, String teamName, Pageable pageable);
    List<ApplicationFormResponseDTO> getApplicationsForTeam(Long teamId);
    Optional<ApplicationFormResponseDTO> getApplicationForTeamAndCompetition(Long teamId, Long competitionId);
    ApplicationFormResponseDTO createQuickApplication(Long competitionId, Long teamId, UserPrincipal currentUser);
}