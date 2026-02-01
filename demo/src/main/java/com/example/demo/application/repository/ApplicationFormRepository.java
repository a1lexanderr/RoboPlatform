package com.example.demo.application.repository;

import com.example.demo.application.domain.ApplicationForm;
import com.example.demo.application.domain.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplicationFormRepository extends JpaRepository<ApplicationForm, Long> {
    List<ApplicationForm> findByTeamId(Long teamId);

    List<ApplicationForm> findByCompetitionId(Long competitionId);

    Page<ApplicationForm> findByCompetitionId(Long competitionId, Pageable pageable);

    Page<ApplicationForm> findByStatus(ApplicationStatus status, Pageable pageable);

    Page<ApplicationForm> findByTeamCaptainId(Long captainId, Pageable pageable);

    boolean existsByTeamIdAndCompetitionId(Long teamId, Long competitionId);

    Optional<ApplicationForm> findByTeamIdAndCompetitionId(Long teamId, Long competitionId);

    @Query("SELECT af FROM ApplicationForm af " +
            "WHERE (:status IS NULL OR af.status = :status) " +
            "AND (:competitionId IS NULL OR af.competition.id = :competitionId) " +
            "AND (:teamName IS NULL OR LOWER(af.team.name) LIKE LOWER(CONCAT('%', :teamName, '%')))")
    Page<ApplicationForm> findWithFilters(
            @Param("status") ApplicationStatus status,
            @Param("competitionId") Long competitionId,
            @Param("teamName") String teamName,
            Pageable pageable
    );

    long countByCompetitionIdAndStatus(Long competitionId, ApplicationStatus status);
}
