package com.example.demo.user.mapper;

import java.util.Set;
import com.example.demo.user.domain.Role;

import com.example.demo.user.domain.User;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.UserRegistrationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "roles", expression = "java(getDefaultRole())")
    @Mapping(target = "enabled", constant = "true")
    @Mapping(target = "accountNonLocked", constant = "true")
    @Mapping(target = "credentialsNonExpired", constant = "true")
    @Mapping(target = "accountNonExpired", constant = "true")
    User toEntity(UserRegistrationDTO registrationDTO);

    UserDTO toDto(User user);

    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    @Mapping(target = "credentialsNonExpired", ignore = true)
    @Mapping(target = "accountNonExpired", ignore = true)
    void updateEntity(@MappingTarget User user, UserDTO dto);

    default Set<Role> getDefaultRole() {
        return Set.of(Role.USER);
    }
}