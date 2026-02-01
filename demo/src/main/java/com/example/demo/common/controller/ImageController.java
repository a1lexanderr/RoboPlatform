package com.example.demo.common.controller;

import com.example.demo.common.Image;
import com.example.demo.common.dto.ImageDTO;
import com.example.demo.common.mapper.ImageMapper;
import com.example.demo.common.service.ImageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("api/v1/images")
public class ImageController {
    private final ImageService imageService;
    private final ImageMapper imageMapper;

    public ImageController(ImageService imageService, ImageMapper imageMapper) {
        this.imageService = imageService;
        this.imageMapper = imageMapper;
    }

    @PostMapping("/upload")
    public ResponseEntity<ImageDTO> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "entityType", defaultValue = "misc") String entityType) {

        log.info("Generic image upload started for entityType: {}", entityType);
        String imageTitle = (title != null && !title.isBlank()) ? title : file.getOriginalFilename();
        Image savedImage = imageService.saveImage(file, imageTitle, false, entityType);
        log.info("Image saved with ID: {}", savedImage.getId());
        return ResponseEntity.ok(imageMapper.toDto(savedImage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageDTO> getImageDetails(@PathVariable Long id) {
        Image image = imageService.findImageById(id);
        return ResponseEntity.ok(imageMapper.toDto(image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        log.info("Request to delete image with ID: {}", id);
        imageService.deleteImage(id);
        log.info("Image with ID: {} deleted successfully", id);
        return ResponseEntity.noContent().build();
    }
}
