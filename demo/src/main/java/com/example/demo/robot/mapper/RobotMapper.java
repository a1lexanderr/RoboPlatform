package com.example.demo.robot.mapper;

import com.example.demo.common.mapper.ImageMapper;
import com.example.demo.robot.domain.Robot;
import com.example.demo.robot.dto.RobotDTO;
import com.example.demo.robot.dto.RobotResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {ImageMapper.class})
public interface RobotMapper {
    RobotResponseDTO toResponseDTO(Robot robot);

    @Mapping(target = "image", ignore = true)
    Robot toEntity(RobotDTO dto);

    @Mapping(target = "image", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateRobotFromDto(RobotDTO dto, @MappingTarget Robot robot);
}
