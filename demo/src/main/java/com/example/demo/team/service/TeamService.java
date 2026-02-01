package com.example.demo.team.service;

import com.example.demo.security.model.UserPrincipal;
import com.example.demo.team.dto.*;
import com.example.demo.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface TeamService {
    TeamResponseDTO createTeam(TeamCreateDTO teamCreateDTO, MultipartFile imageFile, UserPrincipal captain);
    TeamResponseDTO getTeamById(Long teamId);
    TeamResponseDTO updateTeamDetails(Long teamId, TeamUpdateDTO updateDTO, UserPrincipal currentUser);
    TeamResponseDTO updateTeamImage(Long teamId, MultipartFile imageFile, UserPrincipal currentUser);
    void deleteTeam(Long teamId, UserPrincipal currentUser);
    TeamMemberResponseDTO addMemberToTeam(Long teamId, TeamMemberAddDTO memberAddDTO, UserPrincipal currentUser);
    void removeMemberFromTeam(Long teamId, Long userIdToRemove, UserPrincipal currentUser);
    List<TeamMemberResponseDTO> getTeamMembers(Long teamId);
    List<TeamSummaryDTO> getTeamsForUser(UserPrincipal user);
    List<TeamSummaryDTO> getTeamsForCaptain(UserPrincipal user);
    Page<TeamSummaryDTO> getAllTeams(String searchQuery, Pageable pageable);
}