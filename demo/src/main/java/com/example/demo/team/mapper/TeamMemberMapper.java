package com.example.demo.team.mapper;

import com.example.demo.team.domain.TeamMember;
import com.example.demo.team.dto.TeamMemberResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TeamMemberMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.firstName", target = "firstName")
    @Mapping(source = "user.lastName", target = "lastName")
    @Mapping(source = "id", target = "memberRecordId")
    TeamMemberResponseDTO toTeamMemberResponseDTO(TeamMember teamMember);
}
