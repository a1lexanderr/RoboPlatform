package com.example.demo.competition.controller;

import com.example.demo.competition.dto.CompetitionCreateDTO;
import com.example.demo.competition.dto.CompetitionDetailsDTO;
import com.example.demo.competition.dto.CompetitionSummaryDTO;
import com.example.demo.competition.dto.CompetitionUpdateDTO;
import com.example.demo.competition.service.CompetitionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/v1/competitions")
public class CompetitionController {
    private final CompetitionService competitionService;

    public CompetitionController(CompetitionService competitionService) {
        this.competitionService = competitionService;
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<CompetitionDetailsDTO> getCompetitionById(@PathVariable Long id) {
        log.info("Received request to retrieve competition by id {}", id);
        CompetitionDetailsDTO competition = competitionService.findCompetition(id);
        return ResponseEntity.ok(competition);
    }

    @GetMapping
    public ResponseEntity<List<CompetitionSummaryDTO>> getCompetitions() {
        log.info("Received request to retrieve competitions");
        List<CompetitionSummaryDTO> competitions = competitionService.findAllCompetitions();
        return ResponseEntity.ok(competitions);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CompetitionDetailsDTO> createCompetition(
            @Valid @RequestPart("competitionData") CompetitionCreateDTO competitionCreateDTO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        log.info("🎯 Received competition data: {}", competitionCreateDTO);
        CompetitionDetailsDTO competition = competitionService.createCompetition(competitionCreateDTO, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(competition);
    }


    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CompetitionDetailsDTO> updateCompetition(
            @PathVariable Long id,
            @Valid @RequestPart("competitionData") CompetitionUpdateDTO competitionUpdateDTO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        log.info("Received request to update a competition");
        CompetitionDetailsDTO competition = competitionService.updateCompetition(id, competitionUpdateDTO, imageFile);
        log.info("Updated competition '{}' with ID: {}", competition.title(), id);
        return ResponseEntity.status(HttpStatus.OK).body(competition);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteCompetition(@PathVariable Long id) {
        log.info("Received request to delete a competition");
        competitionService.deleteCompetition(id);
        log.info("Deleted competition '{}'", id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
