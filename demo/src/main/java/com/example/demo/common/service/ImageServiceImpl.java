package com.example.demo.common.service;

import com.example.demo.common.Image;
import com.example.demo.common.exception.business.ResourceNotFoundException;
import com.example.demo.common.repository.ImageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;

@Slf4j
@Service
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final FileStorageService fileStorageService;

    public ImageServiceImpl(ImageRepository imageRepository, FileStorageService fileStorageService) {
        this.imageRepository = imageRepository;
        this.fileStorageService = fileStorageService;
    }
    @Override
    public Image saveImage(MultipartFile file, String title, boolean isMain, String entityType) {
        log.info("Saving image");
        String subdirectory = determineSubdirectory(entityType);
        log.info("Subdirectory: {}", subdirectory);
        String filePath = fileStorageService.storeFile(file);
        log.info("Saving image to {}", filePath);

        Image image = Image
                .builder()
                .title(title)
                .isMain(isMain)
                .filePath(filePath)
                .fileName(Paths.get(filePath).getFileName().toString())
                .originalFilename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .url(fileStorageService.buildFileUrl(filePath))
                .build();

        log.info("Saving image to {}", image);
        return imageRepository.save(image);
    }

    public void deleteImage(Long id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

        fileStorageService.deleteFile(image.getFilePath());
        imageRepository.delete(image);
    }

    public Image updateImage(Long imageId, MultipartFile newFile, String newTitle, Boolean isMain) {
        Image existingImage = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

        if (newFile != null && !newFile.isEmpty()) {
            fileStorageService.deleteFile(existingImage.getFilePath());

            String subdirectory = Paths.get(existingImage.getFilePath()).getParent().toString();

            String filePath = fileStorageService.storeFile(newFile);

            existingImage.setFilePath(filePath);
            existingImage.setFileName(Paths.get(filePath).getFileName().toString());
            existingImage.setOriginalFilename(newFile.getOriginalFilename());
            existingImage.setContentType(newFile.getContentType());
            existingImage.setFileSize(newFile.getSize());
            existingImage.setUrl(fileStorageService.buildFileUrl(filePath));
        }

        if (newTitle != null) {
            existingImage.setTitle(newTitle);
        }

        if (isMain != null) {
            existingImage.setMain(isMain);
        }

        return imageRepository.save(existingImage);
    }

    private String determineSubdirectory(String entityType) {
        return switch (entityType) {
            case "team" -> "teams";
            case "robot" -> "robots";
            case "user" -> "users";
            case "competition" -> "competitions";
            case "gallery" -> "gallery";
            case "product" -> "products";
            default -> "misc";
        };
    }

    @Override
    public Image findImageById(Long id) {
        log.debug("Finding image by ID: {}", id);
        return imageRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Image not found with ID: {}", id);
                    return new ResourceNotFoundException("Image not found with id: " + id);
                });
    }
}
