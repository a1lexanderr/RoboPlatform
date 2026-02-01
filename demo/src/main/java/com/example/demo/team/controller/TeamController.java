package com.example.demo.team.controller;


import com.example.demo.robot.dto.RobotDTO;
import com.example.demo.robot.dto.RobotResponseDTO;
import com.example.demo.robot.service.RobotService;
import com.example.demo.security.model.UserPrincipal;
import com.example.demo.team.dto.*;
import com.example.demo.team.service.TeamService;
import com.example.demo.user.domain.User;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teams")
@Slf4j
public class TeamController {

    private final TeamService teamService;
    private final RobotService robotService;

    public TeamController(TeamService teamService, RobotService robotService) {
        this.teamService = teamService;
        this.robotService = robotService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TeamResponseDTO> createTeam(
            @Valid @RequestPart("teamData") TeamCreateDTO teamCreateDTO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("API запрос на создание команды от пользователя: {}", currentUser.getUsername());
        TeamResponseDTO createdTeam = teamService.createTeam(teamCreateDTO, imageFile, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<TeamResponseDTO> getTeamById(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamById(teamId));
    }

    @PutMapping(value = "/{teamId}/details", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TeamResponseDTO> updateTeamDetails(
            @PathVariable Long teamId,
            @Valid @RequestBody TeamUpdateDTO updateDTO,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TeamResponseDTO updatedTeam = teamService.updateTeamDetails(teamId, updateDTO, currentUser);
        return ResponseEntity.ok(updatedTeam);
    }

    @PutMapping(value = "/{teamId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TeamResponseDTO> updateTeamImage(
            @PathVariable Long teamId,
            @RequestPart("imageFile") MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TeamResponseDTO updatedTeam = teamService.updateTeamImage(teamId, imageFile, currentUser);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long teamId, @AuthenticationPrincipal UserPrincipal currentUser) {
        teamService.deleteTeam(teamId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{teamId}/members")
    public ResponseEntity<TeamMemberResponseDTO> addMemberToTeam(
            @PathVariable Long teamId,
            @Valid @RequestBody TeamMemberAddDTO memberAddDTO,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TeamMemberResponseDTO newMember = teamService.addMemberToTeam(teamId, memberAddDTO, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newMember);
    }

    @DeleteMapping("/{teamId}/members/{userIdToRemove}")
    public ResponseEntity<Void> removeMemberFromTeam(
            @PathVariable Long teamId,
            @PathVariable Long userIdToRemove,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        teamService.removeMemberFromTeam(teamId, userIdToRemove, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMemberResponseDTO>> getTeamMembers(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamMembers(teamId));
    }

    @GetMapping("/my-teams")
    public ResponseEntity<List<TeamSummaryDTO>> getCurrentUserTeams(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(teamService.getTeamsForUser(currentUser));
    }

    @GetMapping("/captain/my-teams")
    public ResponseEntity<List<TeamSummaryDTO>> getCurrentCaptainTeams(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(teamService.getTeamsForCaptain(currentUser));
    }

    @GetMapping
    public ResponseEntity<Page<TeamSummaryDTO>> getAllTeams(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(teamService.getAllTeams(search, pageable));
    }

    @PostMapping(value = "/{teamId}/robots", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RobotResponseDTO> createRobotForTeam(
            @PathVariable Long teamId,
            @Valid @RequestPart("robotData") RobotDTO robotDTO,
            @RequestPart(value = "robotImageFile", required = false) MultipartFile robotImageFile,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        RobotResponseDTO robot = robotService.createRobotForTeam(teamId, robotDTO, robotImageFile, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(robot);
    }

    @PutMapping(value = "/{teamId}/robots/{robotId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RobotResponseDTO> updateRobotForTeam(
            @PathVariable Long teamId,
            @PathVariable Long robotId,
            @Valid @RequestPart("robotData") RobotDTO robotDTO,
            @RequestPart(value = "robotImageFile", required = false) MultipartFile robotImageFile,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        RobotResponseDTO robot = robotService.updateRobotForTeam(teamId, robotId, robotDTO, robotImageFile, currentUser);
        return ResponseEntity.ok(robot);
    }

    @DeleteMapping("/{teamId}/robots/{robotId}")
    public ResponseEntity<Void> deleteRobotForTeam(
            @PathVariable Long teamId,
            @PathVariable Long robotId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        robotService.deleteRobotForTeam(teamId, robotId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{teamId}/robots")
    public ResponseEntity<List<RobotResponseDTO>> getAllRobotsForTeam(@PathVariable Long teamId) {
        List<RobotResponseDTO> robots = robotService.findAllByTeamId(teamId);
        return ResponseEntity.ok(robots);
    }

    @GetMapping("/{teamId}/robots/current")
    public ResponseEntity<RobotResponseDTO> getCurrentRobotForTeam(@PathVariable Long teamId) {
        RobotResponseDTO robot = robotService.findCurrentRobotByTeamId(teamId);
        return ResponseEntity.ok(robot);
    }

    @PostMapping("/{teamId}/robots/current/{robotId}")
    public ResponseEntity<RobotResponseDTO> setCurrentRobotForTeam(
            @PathVariable Long teamId,
            @PathVariable Long robotId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        RobotResponseDTO robot = robotService.setCurrentRobot(teamId, robotId, currentUser);
        return ResponseEntity.ok(robot);
    }
}