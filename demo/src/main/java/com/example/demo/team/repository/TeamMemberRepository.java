package com.example.demo.team.repository;

import com.example.demo.team.domain.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    boolean existsByTeamIdAndUserId(Long teamId, Long userId);
    Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId);
    List<TeamMember> findByTeamId(Long teamId);
}
