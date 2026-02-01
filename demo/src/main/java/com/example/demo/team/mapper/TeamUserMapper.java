package com.example.demo.team.mapper;

import com.example.demo.team.dto.UserSummaryDTO;
import com.example.demo.user.domain.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TeamUserMapper {
    UserSummaryDTO toSummaryDTO(User user);
}