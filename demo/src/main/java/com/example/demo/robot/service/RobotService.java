package com.example.demo.robot.service;

import com.example.demo.robot.domain.Robot;
import com.example.demo.robot.dto.RobotDTO;
import com.example.demo.robot.dto.RobotResponseDTO;
import com.example.demo.security.model.UserPrincipal;
import com.example.demo.team.repository.TeamRepository;
import com.example.demo.user.domain.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RobotService {
    RobotResponseDTO createRobotForTeam(Long teamId, RobotDTO robotDTO, MultipartFile file, UserPrincipal user);
    RobotResponseDTO updateRobotForTeam(Long teamId, Long robotId, RobotDTO robotDTO, MultipartFile file, UserPrincipal user);
    void deleteRobotForTeam(Long teamId, Long robotId, UserPrincipal user);
    List<RobotResponseDTO> findAllByTeamId(Long teamId);
    RobotResponseDTO findCurrentRobotByTeamId(Long teamId);
    RobotResponseDTO setCurrentRobot(Long teamId, Long robotId, UserPrincipal user);

}
