package com.example.demo.team.service;

import com.example.demo.common.Image;
import com.example.demo.common.exception.business.ResourceAlreadyExistsException;
import com.example.demo.common.exception.business.ResourceNotFoundException;
import com.example.demo.common.exception.business.team.TeamNotFoundException;
import com.example.demo.common.exception.business.user.UserNotFoundException;
import com.example.demo.common.service.ImageService;
import com.example.demo.robot.domain.Robot;
import com.example.demo.robot.service.RobotService;
import com.example.demo.security.model.UserPrincipal;
import com.example.demo.team.domain.Team;
import com.example.demo.team.domain.TeamMember;
import com.example.demo.team.dto.*;
import com.example.demo.team.mapper.TeamMapper;
import com.example.demo.team.mapper.TeamMemberMapper;
import com.example.demo.team.repository.TeamMemberRepository;
import com.example.demo.team.repository.TeamRepository;
import com.example.demo.user.domain.User;
import com.example.demo.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.internal.util.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final ImageService imageService;
    private final TeamMapper teamMapper;
    private final TeamMemberMapper teamMemberMapper;
    private final RobotService robotService;

    public TeamServiceImpl(
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            UserRepository userRepository,
            ImageService imageService,
            TeamMapper teamMapper,
            TeamMemberMapper teamMemberMapper,
            RobotService robotService
            ){
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
        this.imageService = imageService;
        this.teamMapper = teamMapper;
        this.teamMemberMapper = teamMemberMapper;
        this.robotService = robotService;
    }

    @Override
    @Transactional
    public TeamResponseDTO createTeam(TeamCreateDTO teamCreateDTO, MultipartFile imageFile, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId()).orElseThrow(() -> new UserNotFoundException(currentUser.getId()));

        log.info("Пользователь {} создает команду с названием: {}", currentUser.getUsername(), teamCreateDTO.name());

        if (teamRepository.existsByName(teamCreateDTO.name())) {
            throw new ResourceAlreadyExistsException("Команда с названием '" + teamCreateDTO.name() + "' уже существует.");
        }

        Team team = teamMapper.toEntity(teamCreateDTO);
        team.setCaptain(user);

        if (imageFile != null && !imageFile.isEmpty()) {
            Image teamImage = imageService.saveImage(imageFile, team.getName() + " Logo", true, "team_logos");
            team.setImage(teamImage);
        }

        Team savedTeam = teamRepository.save(team);

        TeamMember captainAsMember = TeamMember.builder()
                .user(user)
                .team(savedTeam)
                .role("Капитан")
                .build();
        teamMemberRepository.save(captainAsMember);
        log.info("Капитан {} добавлен как участник в команду {}", currentUser.getUsername(), savedTeam.getName());

        return teamMapper.toResponseDTO(savedTeam);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponseDTO getTeamById(Long teamId) {
        log.info("=== Запрос команды {} ===", teamId);
        try {
            Team team = teamRepository.findById(teamId)
                    .orElseThrow(() -> new TeamNotFoundException("Команда с ID " + teamId + " не найдена."));

            try {
                TeamResponseDTO dto = teamMapper.toResponseDTO(team);
                log.info("Команда найдена: {}", dto.name());
                return dto;
            } catch (Exception e) {
                log.error("Ошибка при маппинге команды: {}", e.getMessage(), e);
                throw e;
            }

        } catch (TeamNotFoundException e) {
            log.error("Команда не найдена: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Ошибка при маппинге команды с ID {}: {}", teamId, e.getMessage(), e);
            throw e;
        }
    }


    @Override
    @Transactional
    public TeamResponseDTO updateTeamDetails(Long teamId, TeamUpdateDTO updateDTO, UserPrincipal currentUser) {
        log.info("Пользователь {} обновляет детали команды ID: {}", currentUser.getUsername(), teamId);
        Team team = findTeamAndAuthorizeCaptain(teamId, currentUser.getId());

        teamMapper.updateTeamFromDetailsDto(updateDTO, team);
        Team updatedTeam = teamRepository.save(team);
        return teamMapper.toResponseDTO(updatedTeam);
    }

    @Override
    @Transactional
    public TeamResponseDTO updateTeamImage(Long teamId, MultipartFile imageFile, UserPrincipal currentUser) {
        log.info("Пользователь {} обновляет изображение команды ID: {}", currentUser.getUsername(), teamId);
        Team team = findTeamAndAuthorizeCaptain(teamId, currentUser.getId());

        Image oldImage = team.getImage();
        if (imageFile != null && !imageFile.isEmpty()) {
            if (oldImage != null) {
                try {
                    imageService.deleteImage(oldImage.getId());
                } catch (Exception e) {
                    log.error("Не удалось удалить старое изображение команды (Image ID: {}): {}", oldImage.getId(), e.getMessage());
                }
            }
            Image newTeamImage = imageService.saveImage(imageFile, team.getName() + " Logo", true, "team_logos");
            team.setImage(newTeamImage);
        } else {
        }

        Team updatedTeam = teamRepository.save(team);
        return teamMapper.toResponseDTO(updatedTeam);
    }

    @Override
    @Transactional
    public void deleteTeam(Long teamId, UserPrincipal currentUser) {
        log.info("Пользователь {} удаляет команду ID: {}", currentUser.getUsername(), teamId);
        Team team = findTeamAndAuthorizeCaptain(teamId, currentUser.getId());

        if (team.getRobots() != null && !team.getRobots().isEmpty()) {
            for (Robot robot : new ArrayList<>(team.getRobots())) {
                try {
                    robotService.deleteRobotForTeam(teamId, robot.getId(), currentUser);
                    log.info("Робот ID {} команды ID {} удалён.", robot.getId(), teamId);
                } catch (Exception e) {
                    log.error("Ошибка при удалении робота ID {}: {}", robot.getId(), e.getMessage());
                }
            }
        }

        if (team.getImage() != null) {
            try {
                imageService.deleteImage(team.getImage().getId());
                log.info("Изображение команды ID {} удалено.", teamId);
            } catch (Exception e) {
                log.error("Ошибка при удалении изображения для команды ID {}: {}", teamId, e.getMessage());
            }
        }

        teamRepository.delete(team);
        log.info("Команда ID {} успешно удалена.", teamId);
    }


    @Override
    @Transactional
    public TeamMemberResponseDTO addMemberToTeam(Long teamId, TeamMemberAddDTO memberAddDTO, UserPrincipal currentUser) {
        log.info("Пользователь {} добавляет участника ID {} в команду ID {}",
                currentUser.getUsername(), memberAddDTO.userId(), teamId);

        Team team = findTeamAndAuthorizeCaptain(teamId, currentUser.getId());

        User userToAdd = userRepository.findById(memberAddDTO.userId())
                .orElseThrow(() -> new UserNotFoundException(memberAddDTO.userId()));

        boolean alreadyMember = teamMemberRepository.existsByTeamIdAndUserId(teamId, userToAdd.getId());
        if (alreadyMember) {
            throw new ResourceAlreadyExistsException(
                    "Пользователь " + userToAdd.getUsername() + " уже является участником команды " + team.getName());
        }

        TeamMember newMember = TeamMember.builder()
                .user(userToAdd)
                .team(team)
                .role(memberAddDTO.role())
                .build();

        TeamMember savedMember = teamMemberRepository.save(newMember);
        return teamMemberMapper.toTeamMemberResponseDTO(savedMember);
    }


    @Override
    @Transactional
    public void removeMemberFromTeam(Long teamId, Long userIdToRemove, UserPrincipal currentUser) {
        log.info("Пользователь {} удаляет участника ID {} из команды ID {}", currentUser.getUsername(), userIdToRemove, teamId);
        Team team = findTeamAndAuthorizeCaptain(teamId, currentUser.getId());

        User memberUser = userRepository.findById(userIdToRemove)
                .orElseThrow(() -> new UserNotFoundException(userIdToRemove));

        if (team.getCaptain().getId().equals(userIdToRemove)) {
            throw new AccessDeniedException("Капитан не может быть удален из команды этим способом. Рассмотрите смену капитана или удаление команды.");
        }

        TeamMember memberToRemove = teamMemberRepository.findByTeamIdAndUserId(teamId, userIdToRemove)
                .orElseThrow(() -> new ResourceNotFoundException("Участник " + memberUser.getUsername() + " не найден в команде " + team.getName()));

        teamMemberRepository.delete(memberToRemove);
        log.info("Участник {} удален из команды {}", memberUser.getUsername(), team.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponseDTO> getTeamMembers(Long teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new TeamNotFoundException("Команда с ID " + teamId + " не найдена.");
        }
        List<TeamMember> members = teamMemberRepository.findByTeamId(teamId);
        return members.stream()
                .map(teamMemberMapper::toTeamMemberResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamSummaryDTO> getTeamsForUser(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId()).orElseThrow(() -> new UserNotFoundException(currentUser.getId()));
        List<Team> teams = teamRepository.findDistinctByCaptainOrMembersUser(user, user);
        return teams.stream()
                .map(teamMapper::toSummaryDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamSummaryDTO> getTeamsForCaptain(UserPrincipal currentUser){
        User user = userRepository.findById(currentUser.getId()).orElseThrow(() -> new UserNotFoundException(currentUser.getId()));
        List<Team> teams = teamRepository.findDistinctByCaptainOrMembersUser(user, user);
        return teams.stream()
                .map(teamMapper::toSummaryDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamSummaryDTO> getAllTeams(String searchQuery, Pageable pageable) {
        Page<Team> teamsPage;
        if (StringUtils.hasText(searchQuery)) {
            teamsPage = teamRepository.findByNameContainingIgnoreCase(searchQuery, pageable);
        } else {
            teamsPage = teamRepository.findAll(pageable);
        }
        return teamsPage.map(teamMapper::toSummaryDTO);
    }

    private Team findTeamAndAuthorizeCaptain(Long teamId, Long captainUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("Команда с ID " + teamId + " не найдена."));
        if (!team.getCaptain().getId().equals(captainUserId)) {
            throw new AccessDeniedException("Доступ запрещен. Только капитан команды может выполнять это действие.");
        }
        return team;
    }
}
