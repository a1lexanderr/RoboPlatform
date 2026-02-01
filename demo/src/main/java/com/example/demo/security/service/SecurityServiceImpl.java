package com.example.demo.security.service;

import com.example.demo.common.exception.business.team.TeamNotFoundException;
import com.example.demo.team.domain.Team;
import com.example.demo.team.repository.TeamRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class SecurityServiceImpl implements SecurityService {
    private final TeamRepository teamRepository;
    public SecurityServiceImpl(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Override
    public void checkTeamCaptainAccess(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("Team not found"));

        if (!team.getCaptain().getId().equals(userId)) {
            throw new AccessDeniedException("Only team captain can manage this team");
        }
    }
}
