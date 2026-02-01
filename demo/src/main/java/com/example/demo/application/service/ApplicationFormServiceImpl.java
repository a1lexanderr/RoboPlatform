package com.example.demo.application.service;

import com.example.demo.application.domain.ApplicationForm;
import com.example.demo.application.domain.ApplicationStatus;
import com.example.demo.application.dto.*;
import com.example.demo.application.mapper.ApplicationFormMapper;
import com.example.demo.application.repository.ApplicationFormRepository;
import com.example.demo.competition.domain.Competition;
import com.example.demo.competition.domain.CompetitionStatus;
import com.example.demo.competition.repository.CompetitionRepository;
import com.example.demo.security.model.UserPrincipal;
import com.example.demo.team.domain.Team;
import com.example.demo.team.repository.TeamRepository;
import com.example.demo.user.domain.User;
import com.example.demo.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class ApplicationFormServiceImpl implements ApplicationFormService {

    private final ApplicationFormRepository applicationFormRepository;
    private final TeamRepository teamRepository;
    private final CompetitionRepository competitionRepository;
    private final UserRepository userRepository;
    private final ApplicationFormMapper applicationFormMapper;

    public ApplicationFormServiceImpl(
            ApplicationFormRepository applicationFormRepository,
            TeamRepository teamRepository,
            CompetitionRepository competitionRepository,
            UserRepository userRepository,
            ApplicationFormMapper applicationFormMapper) {
        this.applicationFormRepository = applicationFormRepository;
        this.teamRepository = teamRepository;
        this.competitionRepository = competitionRepository;
        this.userRepository = userRepository;
        this.applicationFormMapper = applicationFormMapper;
    }

    @Transactional
    public ApplicationFormResponseDTO createQuickApplication(
            Long competitionId, Long teamId, UserPrincipal currentUser) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Команда не найдена"));

        validateTeamAccess(team, currentUser);

        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new EntityNotFoundException("Соревнование не найдено"));

        if (applicationFormRepository.existsByTeamIdAndCompetitionId(teamId, competitionId)) {
            throw new IllegalArgumentException("Application already exists for this team and competition");
        }

        if (competition.getStatus() != CompetitionStatus.OPEN) {
            throw new IllegalArgumentException("Registration is not open for this competition");
        }

        ApplicationForm newApp = ApplicationForm.builder()
                .team(team)
                .competition(competition)
                .status(ApplicationStatus.PENDING)
                .teamExperience("—")
                .robotSpecifications("—")
                .additionalEquipment("—")
                .specialRequirements("—")
                .build();

        applicationFormRepository.save(newApp);

        return applicationFormMapper.toResponseDTO(newApp);
    }


    @Override
    public ApplicationFormResponseDTO createApplication(
            ApplicationFormCreateDTO createDTO,
            UserPrincipal currentUser) {
        log.info("Создание заявки на участие в соревновании {} от команды {}",
                createDTO.competitionId(), createDTO.teamId());

        Team team = teamRepository.findById(createDTO.teamId())
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + createDTO.teamId()));

        validateTeamAccess(team, currentUser);

        Competition competition = competitionRepository.findById(createDTO.competitionId())
                .orElseThrow(() -> new EntityNotFoundException("Competition not found with id: " + createDTO.competitionId()));

        if (applicationFormRepository.existsByTeamIdAndCompetitionId(createDTO.teamId(), createDTO.competitionId())) {
            throw new IllegalArgumentException("Application already exists for this team and competition");
        }

        if (competition.getStatus() != CompetitionStatus.OPEN) {
            throw new IllegalArgumentException("Registration is not open for this competition");
        }

        ApplicationForm applicationForm = applicationFormMapper.toEntity(createDTO);
        applicationForm.setTeam(team);
        applicationForm.setCompetition(competition);
        applicationForm.setStatus(ApplicationStatus.PENDING);

        ApplicationForm savedApplication = applicationFormRepository.save(applicationForm);
        log.info("Заявка создана с ID: {}", savedApplication.getId());

        return applicationFormMapper.toResponseDTO(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationFormResponseDTO getApplicationById(Long applicationId) {
        ApplicationForm application = applicationFormRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));

        return applicationFormMapper.toResponseDTO(application);
    }

    @Override
    public ApplicationFormResponseDTO updateApplication(
            Long applicationId,
            ApplicationFormUpdateDTO updateDTO,
            UserPrincipal currentUser) {
        log.info("Обновление заявки с ID: {}", applicationId);

        ApplicationForm application = applicationFormRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));

        validateTeamAccess(application.getTeam(), currentUser);

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalArgumentException("Cannot update application with status: " + application.getStatus());
        }

        applicationFormMapper.updateApplicationFromDto(updateDTO, application);

        ApplicationForm savedApplication = applicationFormRepository.save(application);
        log.info("Заявка обновлена с ID: {}", savedApplication.getId());

        return applicationFormMapper.toResponseDTO(savedApplication);
    }

    @Override
    public ApplicationFormResponseDTO reviewApplication(
            Long applicationId,
            ApplicationFormReviewDTO reviewDTO,
            UserPrincipal currentUser) {
        log.info("Рассмотрение заявки с ID: {} пользователем: {}", applicationId, currentUser.getUsername());

        if (!currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Only administrators can review applications");
        }

        ApplicationForm application = applicationFormRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));

        User reviewer = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Reviewer not found"));

        application.setStatus(reviewDTO.status());
        application.setAdminComment(reviewDTO.adminComment());
        application.setReviewedAt(LocalDateTime.now());
        application.setReviewedBy(reviewer);

        ApplicationForm savedApplication = applicationFormRepository.save(application);
        log.info("Заявка рассмотрена с ID: {}, статус: {}", savedApplication.getId(), reviewDTO.status());

        return applicationFormMapper.toResponseDTO(savedApplication);
    }

    @Override
    public void deleteApplication(Long applicationId, UserPrincipal currentUser) {
        log.info("Удаление заявки с ID: {}", applicationId);

        ApplicationForm application = applicationFormRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + applicationId));

        validateTeamAccess(application.getTeam(), currentUser);

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalArgumentException("Cannot delete application with status: " + application.getStatus());
        }

        applicationFormRepository.delete(application);
        log.info("Заявка удалена с ID: {}", applicationId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationFormSummaryDTO> getApplicationsForUser(UserPrincipal currentUser, Pageable pageable) {
        Page<ApplicationForm> applications = applicationFormRepository.findByTeamCaptainId(currentUser.getId(), pageable);
        return applications.map(applicationFormMapper::toSummaryDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationFormResponseDTO> getApplicationsForCompetition(Long competitionId, Pageable pageable) {
        Page<ApplicationForm> applications = applicationFormRepository.findByCompetitionId(competitionId, pageable);
        return applications.map(applicationFormMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationFormResponseDTO> getAllApplicationsWithFilters(
            ApplicationStatus status,
            Long competitionId,
            String teamName,
            Pageable pageable) {
        Page<ApplicationForm> applications = applicationFormRepository.findWithFilters(
                status, competitionId, teamName, pageable);
        return applications.map(applicationFormMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationFormResponseDTO> getApplicationsForTeam(Long teamId) {
        List<ApplicationForm> applications = applicationFormRepository.findByTeamId(teamId);
        return applications.stream()
                .map(applicationFormMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ApplicationFormResponseDTO> getApplicationForTeamAndCompetition(Long teamId, Long competitionId) {
        return applicationFormRepository.findByTeamIdAndCompetitionId(teamId, competitionId)
                .map(applicationFormMapper::toResponseDTO);
    }

    private void validateTeamAccess(Team team, UserPrincipal currentUser) {
        if (!team.getCaptain().getId().equals(currentUser.getId()) &&
                !currentUser.getAuthorities().stream()
                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("You can only manage applications for your own teams");
        }
    }
}
