package com.example.demo.common.mapper;

import com.example.demo.common.Image;
import com.example.demo.common.dto.ImageDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    ImageDTO toDto(Image image);
    List<ImageDTO> toDtoList(List<Image> images);
}
