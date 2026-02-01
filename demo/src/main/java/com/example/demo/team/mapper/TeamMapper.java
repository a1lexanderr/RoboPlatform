package com.example.demo.team.mapper;

import com.example.demo.common.Image;
import com.example.demo.common.dto.ImageDTO;
import com.example.demo.common.mapper.ImageMapper;
import com.example.demo.robot.domain.Robot;
import com.example.demo.robot.dto.RobotResponseDTO;
import com.example.demo.robot.mapper.RobotMapper;
import com.example.demo.team.domain.Team;
import com.example.demo.team.domain.TeamMember;
import com.example.demo.team.dto.*;
import com.example.demo.user.domain.User;
import com.example.demo.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {ImageMapper.class, UserMapper.class, RobotMapper.class, TeamMemberMapper.class})
public interface TeamMapper {
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "captain", ignore = true)
    @Mapping(target = "currentRobot", ignore = true)
    @Mapping(target = "members", ignore = true)
    @Mapping(target = "applications", ignore = true)
    Team toEntity(TeamCreateDTO createDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "captain", ignore = true)
    @Mapping(target = "members", ignore = true)
    @Mapping(target = "applications", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateTeamFromDetailsDto(TeamUpdateDTO dto, @MappingTarget Team entity);

    @Mapping(source = "currentRobot", target = "robot", qualifiedByName = "robotToResponseDTO")
    @Mapping(source = "members", target = "members", qualifiedByName = "membersToResponseDTO")
    @Mapping(source = "image", target = "image", qualifiedByName = "imageToDTO")
    TeamResponseDTO toResponseDTO(Team team);

    @Named("robotToResponseDTO")
    default RobotResponseDTO robotToResponseDTO(Robot robot) {
        if (robot == null) return null;

        return new RobotResponseDTO(
                robot.getId(),
                robot.getName(),
                robot.getDescription(),
                robot.getImage() != null ? imageToDTO(robot.getImage()) : null
        );
    }

    @Named("membersToResponseDTO")
    default List<TeamMemberResponseDTO> membersToResponseDTO(List<TeamMember> members) {
        if (members == null) return new ArrayList<>();

        return members.stream()
                .map(this::memberToResponseDTO)
                .collect(Collectors.toList());
    }

    @Named("memberToResponseDTO")
    default TeamMemberResponseDTO memberToResponseDTO(TeamMember member) {
        if (member == null || member.getUser() == null) return null;

        User user = member.getUser();
        return new TeamMemberResponseDTO(
                member.getId(),
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                member.getRole()
        );
    }

    @Named("imageToDTO")
    default ImageDTO imageToDTO(Image image) {
        if (image == null) return null;

        return new ImageDTO(
                image.getId(),
                image.getTitle(),
                image.getUrl()
        );
    }
    @Mapping(source = "image.url", target = "image")
    TeamSummaryDTO toSummaryDTO(Team team);
}