package com.example.demo.application.mapper;

import com.example.demo.application.domain.ApplicationForm;
import com.example.demo.application.dto.ApplicationFormCreateDTO;
import com.example.demo.application.dto.ApplicationFormResponseDTO;
import com.example.demo.application.dto.ApplicationFormSummaryDTO;
import com.example.demo.application.dto.ApplicationFormUpdateDTO;
import com.example.demo.competition.mapper.CompetitionMapper;
import com.example.demo.team.mapper.TeamMapper;
import com.example.demo.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {TeamMapper.class, CompetitionMapper.class, UserMapper.class})
public interface ApplicationFormMapper {
    @Mapping(target = "team", ignore = true)
    @Mapping(target = "competition", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "adminComment", ignore = true)
    @Mapping(target = "reviewedAt", ignore = true)
    @Mapping(target = "reviewedBy", ignore = true)
    ApplicationForm toEntity(ApplicationFormCreateDTO createDTO);

    @Mapping(target = "team", ignore = true)
    @Mapping(target = "competition", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "adminComment", ignore = true)
    @Mapping(target = "reviewedAt", ignore = true)
    @Mapping(target = "reviewedBy", ignore = true)
    void updateApplicationFromDto(ApplicationFormUpdateDTO updateDTO, @MappingTarget ApplicationForm application);

    default ApplicationFormResponseDTO toResponseDTO(ApplicationForm form) {
        if (form == null) return null;

        return new ApplicationFormResponseDTO(
                form.getId(),
                form.getTeam() != null ? form.getTeam().getId() : null,
                form.getTeam() != null ? form.getTeam().getName() : null,
                form.getCompetition() != null ? form.getCompetition().getId() : null,
                form.getCompetition() != null ? form.getCompetition().getTitle() : null,
                form.getStatus(),
                form.getTeamExperience(),
                form.getRobotSpecifications(),
                form.getAdditionalEquipment(),
                form.getSpecialRequirements(),
                form.getAdminComment(),
                form.getCreatedAt(),
                form.getUpdatedAt(),
                form.getReviewedAt(),
                form.getReviewedBy() != null ? form.getReviewedBy().getUsername() : null
        );
    }

    @Mapping(source = "team.name", target = "teamName")
    @Mapping(source = "competition.title", target = "competitionTitle")
    ApplicationFormSummaryDTO toSummaryDTO(ApplicationForm applicationForm);
}