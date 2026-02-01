package com.example.demo.application.controller;


import com.example.demo.application.domain.ApplicationStatus;
import com.example.demo.application.dto.*;
import com.example.demo.application.service.ApplicationFormService;
import com.example.demo.security.model.UserPrincipal;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@Slf4j
public class ApplicationFormController {

    private final ApplicationFormService applicationFormService;

    public ApplicationFormController(ApplicationFormService applicationFormService) {
        this.applicationFormService = applicationFormService;
    }

    @PostMapping("/quick")
    public ResponseEntity<ApplicationFormResponseDTO> quickApply(
            @RequestParam Long competitionId,
            @RequestParam Long teamId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("Быстрая заявка: user={} teamId={} competitionId={}",
                currentUser.getUsername(), teamId, competitionId);

        ApplicationFormResponseDTO application =
                applicationFormService.createQuickApplication(competitionId, teamId, currentUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(application);
    }


    @PostMapping
    public ResponseEntity<ApplicationFormResponseDTO> createApplication(
            @Valid @RequestBody ApplicationFormCreateDTO createDTO,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("API запрос на создание заявки от пользователя: {}", currentUser.getUsername());
        ApplicationFormResponseDTO application = applicationFormService.createApplication(createDTO, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(application);
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationFormResponseDTO> getApplicationById(@PathVariable Long applicationId) {
        return ResponseEntity.ok(applicationFormService.getApplicationById(applicationId));
    }

    @PutMapping("/{applicationId}")
    public ResponseEntity<ApplicationFormResponseDTO> updateApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationFormUpdateDTO updateDTO,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ApplicationFormResponseDTO updatedApplication = applicationFormService.updateApplication(
                applicationId, updateDTO, currentUser);
        return ResponseEntity.ok(updatedApplication);
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        applicationFormService.deleteApplication(applicationId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{applicationId}/review")
    public ResponseEntity<ApplicationFormResponseDTO> reviewApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationFormReviewDTO reviewDTO,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ApplicationFormResponseDTO reviewedApplication = applicationFormService.reviewApplication(
                applicationId, reviewDTO, currentUser);
        return ResponseEntity.ok(reviewedApplication);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<Page<ApplicationFormSummaryDTO>> getCurrentUserApplications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(applicationFormService.getApplicationsForUser(currentUser, pageable));
    }

    @GetMapping("/competition/{competitionId}")
    public ResponseEntity<Page<ApplicationFormResponseDTO>> getApplicationsForCompetition(
            @PathVariable Long competitionId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(applicationFormService.getApplicationsForCompetition(competitionId, pageable));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<ApplicationFormResponseDTO>> getApplicationsForTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(applicationFormService.getApplicationsForTeam(teamId));
    }

    @GetMapping("/team/{teamId}/competition/{competitionId}")
    public ResponseEntity<ApplicationFormResponseDTO> getApplicationForTeamAndCompetition(
            @PathVariable Long teamId,
            @PathVariable Long competitionId) {
        return applicationFormService.getApplicationForTeamAndCompetition(teamId, competitionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<ApplicationFormResponseDTO>> getAllApplications(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) Long competitionId,
            @RequestParam(required = false) String teamName,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(applicationFormService.getAllApplicationsWithFilters(
                status, competitionId, teamName, pageable));
    }
}
