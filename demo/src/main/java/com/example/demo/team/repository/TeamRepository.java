package com.example.demo.team.repository;

import com.example.demo.team.domain.Team;
import com.example.demo.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    boolean existsByName(String name);
    Page<Team> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT DISTINCT t FROM Team t LEFT JOIN t.members m WHERE t.captain = :captainUser OR m.user = :memberUser")
    List<Team> findDistinctByCaptainOrMembersUser(@Param("captainUser") User captainUser, @Param("memberUser") User memberUser);
    @Query("SELECT DISTINCT t FROM Team t LEFT JOIN t.members m WHERE t.captain = :captainUser")
    List<Team> findDistinctByCaptain(@Param("captainUser") User captainUser);
}
