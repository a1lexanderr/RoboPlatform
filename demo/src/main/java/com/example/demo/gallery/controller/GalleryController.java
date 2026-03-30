package com.example.demo.gallery.controller;

import com.example.demo.gallery.dto.GalleryImageDTO;
import com.example.demo.gallery.domain.GalleryImage;
import com.example.demo.gallery.service.GalleryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;

    private GalleryImageDTO toDto(GalleryImage image) {
        return new GalleryImageDTO(image.getId(), image.getTitle(), image.getUrl());
    }

    @GetMapping
    public ResponseEntity<List<GalleryImageDTO>> getAll() {
        List<GalleryImageDTO> images = galleryService.getAllImages().stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(images);
    }

    @PostMapping("/upload")
    public ResponseEntity<GalleryImageDTO> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title) {
        
        GalleryImage savedImage = galleryService.uploadImage(file, title);
        return ResponseEntity.ok(toDto(savedImage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        galleryService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}