package com.example.demo.competition.service;

import com.example.demo.competition.dto.CompetitionCreateDTO;
import com.example.demo.competition.dto.CompetitionDetailsDTO;
import com.example.demo.competition.dto.CompetitionSummaryDTO;
import com.example.demo.competition.dto.CompetitionUpdateDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CompetitionService {
    CompetitionDetailsDTO createCompetition(CompetitionCreateDTO competitionCreateDTO, MultipartFile file);
    CompetitionDetailsDTO updateCompetition(Long id, CompetitionUpdateDTO competitionUpdateDTO, MultipartFile newImageFile);
    void deleteCompetition(Long id);
    CompetitionDetailsDTO findCompetition(Long id);
    List<CompetitionSummaryDTO> findAllCompetitions();
}
