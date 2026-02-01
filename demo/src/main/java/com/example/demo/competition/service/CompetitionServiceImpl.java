package com.example.demo.competition.service;

import com.example.demo.common.Image;
import com.example.demo.common.exception.business.competition.CompetitionNotFoundException;
import com.example.demo.common.service.ImageService;
import com.example.demo.competition.domain.Competition;
import com.example.demo.competition.dto.CompetitionCreateDTO;
import com.example.demo.competition.dto.CompetitionDetailsDTO;
import com.example.demo.competition.dto.CompetitionSummaryDTO;
import com.example.demo.competition.dto.CompetitionUpdateDTO;
import com.example.demo.competition.mapper.CompetitionMapper;
import com.example.demo.competition.repository.CompetitionRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
public class CompetitionServiceImpl implements CompetitionService {
    private final CompetitionRepository competitionRepository;
    private final ImageService imageService;
    private final CompetitionMapper competitionMapper;

    public CompetitionServiceImpl(
            CompetitionRepository competitionRepository,
            ImageService imageService,
            CompetitionMapper competitionMapper) {
        this.competitionRepository = competitionRepository;
        this.imageService = imageService;
        this.competitionMapper = competitionMapper;
    }

    @Transactional
    public CompetitionDetailsDTO createCompetition(CompetitionCreateDTO createDTO, MultipartFile imageFile) {
        try {
            log.info("Attempting to create competition: {}", createDTO.title());

            Image savedImage = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                savedImage = imageService.saveImage(imageFile, createDTO.title() + " Image", true, "competition");
                log.info("Image saved for competition '{}', Image ID: {}", createDTO.title(), savedImage.getId());
            }

            Competition competition = competitionMapper.toCompetitionEntity(createDTO);
            log.info("Competition entity after mapping: {}", competition);
            competition.setImage(savedImage);

            Competition savedCompetition = competitionRepository.save(competition);
            log.info("Competition '{}' created successfully with ID: {}", savedCompetition.getTitle(), savedCompetition.getId());

            return competitionMapper.toDetailsDTO(savedCompetition);
        } catch (Exception e) {
            log.error("Failed to create competition: {}", e.getMessage(), e);
            throw e;
        }
    }


    @Transactional
    public CompetitionDetailsDTO updateCompetition(Long id, CompetitionUpdateDTO updateDTO, MultipartFile newImageFile) {
        try {
            log.info("Attempting to update competition with ID: {}", id);
            Competition existingCompetition = competitionRepository.findById(id)
                    .orElseThrow(() -> new CompetitionNotFoundException("Competition not found with ID: " + id));

            Image imageToAssociate = existingCompetition.getImage();

            if (newImageFile != null && !newImageFile.isEmpty()) {
                log.info("New image file provided for competition ID: {}. Replacing existing image if present.", id);
                Image oldImage = existingCompetition.getImage();
                if (oldImage != null) {
                    log.debug("Deleting old image with ID: {} for competition ID: {}", oldImage.getId(), id);
                    imageService.deleteImage(oldImage.getId());
                }
                imageToAssociate = imageService.saveImage(newImageFile, updateDTO.title() + " Image", true, "competition");
                log.info("New image saved for competition ID: {}, New Image ID: {}", id, imageToAssociate.getId());
            }

            competitionMapper.updateCompetitionFromDto(updateDTO, existingCompetition);
            existingCompetition.setImage(imageToAssociate);

            Competition updatedCompetition = competitionRepository.save(existingCompetition);
            log.info("Competition with ID: {} updated successfully.", id);

            return competitionMapper.toDetailsDTO(updatedCompetition);
        } catch (Exception e) {
            log.error("Error while updating competition {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }


    @Transactional
    public void deleteCompetition(Long id) {
        log.info("Attempting to delete competition with ID: {}", id);

        Competition competition = competitionRepository.findById(id)
                .orElseThrow(() -> new CompetitionNotFoundException("Competition not found with id: " + id));

        Image image = competition.getImage();
        if (image != null) {
            log.info("Deleting associated image with ID: {} for competition ID: {}", image.getId(), id);
            try {
                imageService.deleteImage(image.getId());
            } catch (Exception e) {
                log.error("Failed to delete associated image (ID: {}) for competition (ID: {}). Error: {}", image.getId(), id, e.getMessage(), e);
            }
        } else {
            log.info("Competition with ID: {} has no associated image to delete.", id);
        }

        competitionRepository.delete(competition);
        log.info("Competition with ID: {} deleted successfully.", id);
    }

    @Transactional(readOnly = true)
    public CompetitionDetailsDTO findCompetition(Long id) {
        Competition competition = competitionRepository.findById(id)
                .orElseThrow(() -> new CompetitionNotFoundException("Competition not found with id: " + id));
        return competitionMapper.toDetailsDTO(competition);
    }

    @Transactional(readOnly = true)
    public List<CompetitionSummaryDTO> findAllCompetitions() {
        List<Competition> competitions = competitionRepository.findAll();
        return competitionMapper.toSummaryDTOs(competitions);
    }

}
