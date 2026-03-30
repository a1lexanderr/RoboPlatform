package com.example.demo.gallery.service;

import com.example.demo.common.exception.business.ResourceNotFoundException;
import com.example.demo.common.service.FileStorageService;
import com.example.demo.gallery.domain.GalleryImage;
import com.example.demo.gallery.repository.GalleryImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryImageRepository galleryRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<GalleryImage> getAllImages() {
        return galleryRepository.findAll();
    }

    @Transactional
    public GalleryImage uploadImage(MultipartFile file, String title) {
        log.info("Uploading new gallery image...");

        String filePath = fileStorageService.storeFile(file);
        String url = fileStorageService.buildFileUrl(filePath);

        GalleryImage image = GalleryImage.builder()
                .title((title != null && !title.isBlank()) ? title : file.getOriginalFilename())
                .filePath(filePath)
                .url(url)
                .build();

        return galleryRepository.save(image);
    }

    @Transactional
    public void deleteImage(Long id) {
        GalleryImage image = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery image not found"));

        // Удаляем физически с диска
        fileStorageService.deleteFile(image.getFilePath());
        // Удаляем запись из БД
        galleryRepository.delete(image);
        log.info("Gallery image with id {} deleted", id);
    }
}
