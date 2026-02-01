package com.example.demo.robot.service;

import com.example.demo.common.Image;
import com.example.demo.common.exception.business.robot.RobotNotFoundException;
import com.example.demo.common.exception.business.team.TeamNotFoundException;
import com.example.demo.common.service.ImageService;
import com.example.demo.robot.domain.Robot;
import com.example.demo.robot.dto.RobotDTO;
import com.example.demo.robot.dto.RobotResponseDTO;
import com.example.demo.robot.mapper.RobotMapper;
import com.example.demo.robot.repository.RobotRepository;
import com.example.demo.security.model.UserPrincipal;
import com.example.demo.team.domain.Team;
import com.example.demo.team.repository.TeamRepository;
import com.example.demo.user.domain.User;
import com.example.demo.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
public class RobotServiceImpl implements RobotService {
    private final TeamRepository teamRepository;
    private final RobotRepository robotRepository;
    private final UserRepository userRepository;
    private final ImageService imageService;
    private final RobotMapper robotMapper;

    public RobotServiceImpl(
            TeamRepository teamRepository,
            RobotRepository robotRepository,
            UserRepository userRepository,
            RobotMapper robotMapper,
            ImageService imageService) {
        this.teamRepository = teamRepository;
        this.robotRepository = robotRepository;
        this.userRepository = userRepository;
        this.robotMapper = robotMapper;
        this.imageService = imageService;
    }

    @Override
    @Transactional
    public RobotResponseDTO createRobotForTeam(Long teamId, RobotDTO robotDTO,
                                               MultipartFile imageFile,
                                               UserPrincipal currentUser) {
        log.info("Создание робота для команды ID: {} пользователем: {}", teamId, currentUser.getUsername());

        Team team = findTeamOrThrow(teamId);
        authorizeTeamMemberOrCaptain(team, currentUser);

        User creator = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id " + currentUser.getId()));

        Robot robot = robotMapper.toEntity(robotDTO);
        robot.setTeam(team);
        robot.setCreatedBy(creator);

        processRobotImage(robot, imageFile, null);

        Robot saved = robotRepository.save(robot);
        log.info("Робот ID: {} успешно создан для команды ID: {}", saved.getId(), teamId);
        return robotMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public RobotResponseDTO updateRobotForTeam(Long teamId,
                                               Long robotId,
                                               RobotDTO robotDTO,
                                               MultipartFile imageFile,
                                               UserPrincipal currentUser) {
        log.info("Обновление робота ID: {} для команды ID: {} пользователем: {}",
                robotId, teamId, currentUser.getUsername());

        Team team = findTeamOrThrow(teamId);
        authorizeTeamMemberOrCaptain(team, currentUser);

        Robot robot = robotRepository.findById(robotId)
                .orElseThrow(() -> new RobotNotFoundException("Робот не найден с ID " + robotId));

        if (!robot.getTeam().getId().equals(teamId)) {
            throw new IllegalArgumentException("Робот не принадлежит этой команде");
        }

        boolean isAuthor = robot.getCreatedBy() != null && robot.getCreatedBy().getId().equals(currentUser.getId());
        boolean isCaptain = team.getCaptain().getId().equals(currentUser.getId());
        if (!isAuthor && !isCaptain) {
            throw new AccessDeniedException("Вы не можете редактировать этого робота");
        }

        Image oldImage = robot.getImage();
        robotMapper.updateRobotFromDto(robotDTO, robot);
        processRobotImage(robot, imageFile, oldImage);

        Robot saved = robotRepository.save(robot);
        log.info("Робот ID: {} обновлён.", saved.getId());
        return robotMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void deleteRobotForTeam(Long teamId, Long robotId, UserPrincipal currentUser) {
        log.info("Удаление робота ID: {} для команды ID: {} пользователем: {}",
                robotId, teamId, currentUser.getUsername());

        Team team = findTeamOrThrow(teamId);
        authorizeTeamMemberOrCaptain(team, currentUser);

        Robot robot = robotRepository.findById(robotId)
                .orElseThrow(() -> new RobotNotFoundException("Робот не найден с ID " + robotId));

        if (!robot.getTeam().getId().equals(teamId)) {
            throw new IllegalArgumentException("Робот не принадлежит этой команде");
        }

        boolean isAuthor = robot.getCreatedBy() != null && robot.getCreatedBy().getId().equals(currentUser.getId());
        boolean isCaptain = team.getCaptain().getId().equals(currentUser.getId());
        if (!isAuthor && !isCaptain) {
            throw new AccessDeniedException("Вы не можете удалить этого робота");
        }

        if (team.getCurrentRobot() != null && team.getCurrentRobot().getId().equals(robotId)) {
            team.setCurrentRobot(null);
            teamRepository.save(team);
        }

        Image imageToDelete = robot.getImage();
        robotRepository.delete(robot);
        log.info("Робот ID: {} удалён.", robotId);

        if (imageToDelete != null) {
            try {
                imageService.deleteImage(imageToDelete.getId());
            } catch (Exception e) {
                log.error("Ошибка при удалении изображения: {}", e.getMessage());
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RobotResponseDTO> findAllByTeamId(Long teamId) {
        Team team = findTeamOrThrow(teamId);
        return team.getRobots().stream()
                .map(robotMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RobotResponseDTO findCurrentRobotByTeamId(Long teamId) {
        Team team = findTeamOrThrow(teamId);
        Robot current = team.getCurrentRobot();
        if (current == null) {
            throw new RobotNotFoundException("У команды нет текущего робота");
        }
        return robotMapper.toResponseDTO(current);
    }

    @Override
    @Transactional
    public RobotResponseDTO setCurrentRobot(Long teamId, Long robotId, UserPrincipal currentUser) {
        Team team = findTeamOrThrow(teamId);

        if (!team.getCaptain().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Только капитан может назначать текущего робота");
        }

        Robot robot = robotRepository.findById(robotId)
                .orElseThrow(() -> new RobotNotFoundException("Робот не найден с ID " + robotId));

        if (!robot.getTeam().getId().equals(teamId)) {
            throw new IllegalArgumentException("Робот не принадлежит этой команде");
        }

        team.setCurrentRobot(robot);
        teamRepository.save(team);
        log.info("Текущий робот команды ID {} установлен в {}", teamId, robotId);
        return robotMapper.toResponseDTO(robot);
    }

    private void processRobotImage(Robot robot, MultipartFile imageFile, Image oldImageToDelete) {
        if (imageFile != null && !imageFile.isEmpty()) {
            if (oldImageToDelete != null) {
                try {
                    imageService.deleteImage(oldImageToDelete.getId());
                } catch (Exception e) {
                    log.error("Не удалось удалить старое изображение: {}", e.getMessage());
                }
            }
            String title = (robot.getName() != null ? robot.getName() : "Robot") + " image";
            Image newImage = imageService.saveImage(imageFile, title, false, "robot_profile");
            robot.setImage(newImage);
        }
    }

    private Team findTeamOrThrow(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("Команда с ID " + teamId + " не найдена."));
    }

    private void authorizeTeamMemberOrCaptain(Team team, UserPrincipal currentUser) {
        boolean isCaptain = team.getCaptain().getId().equals(currentUser.getId());
        boolean isMember = team.getMembers().stream()
                .anyMatch(m -> m.getUser().getId().equals(currentUser.getId()));

        if (!isCaptain && !isMember) {
            throw new AccessDeniedException("Вы не состоите в этой команде.");
        }
    }
}
