package com.example.demo.competition.mapper;

import com.example.demo.common.mapper.ImageMapper;
import com.example.demo.competition.domain.Competition;
import com.example.demo.competition.dto.CompetitionCreateDTO;
import com.example.demo.competition.dto.CompetitionDetailsDTO;
import com.example.demo.competition.dto.CompetitionSummaryDTO;
import com.example.demo.competition.dto.CompetitionUpdateDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ImageMapper.class})
public interface CompetitionMapper {
    @Mapping(source = "image.url", target = "image")
    CompetitionSummaryDTO toSummaryDTO(Competition competition);

    @Mapping(source = "location", target = "location")
    CompetitionDetailsDTO toDetailsDTO(Competition competition);

    List<CompetitionSummaryDTO> toSummaryDTOs(List<Competition> competitions);

    @Mapping(target = "image", ignore = true)
    @Mapping(target = "applications", ignore = true)
    @Mapping(source = "location", target = "location")
    Competition toCompetitionEntity(CompetitionCreateDTO competitionCreateDTO);

    @Mapping(target = "image", ignore = true)
    @Mapping(target = "applications", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "location", target = "location")
    void updateCompetitionFromDto(CompetitionUpdateDTO dto, @MappingTarget Competition entity);
}
