package com.example.demo.common.service;

import com.example.demo.common.exception.business.file.InvalidFileException;
import com.example.demo.common.exception.business.user.UserNotFoundException;
import com.example.demo.common.exception.technical.StorageException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.file-storage.location:uploads}")
    private String storageLocation;

    @Value("${app.file-storage.allowed-types:image/jpeg,image/png,image/gif}")
    private List<String> allowedTypes;

    @Value("${app.file-storage.max-size:5242880}") // 5MB по умолчанию
    private long maxFileSize;

    @Value("${app.base-url}")
    private String baseUrl;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        try {
            log.info("Initializing storage with location: {}", storageLocation);
            rootLocation = Paths.get(storageLocation).toAbsolutePath().normalize();
            log.debug("Normalized absolute path: {}", rootLocation);

            if (Files.exists(rootLocation)) {
                log.info("Storage directory already exists: {}", rootLocation);
            } else {
                Files.createDirectories(rootLocation);
                log.info("Created storage directory: {}", rootLocation);
            }
        } catch (IOException e) {
            log.error("Failed to initialize storage at location: {}. Error: {}", storageLocation, e.getMessage(), e);
            throw new StorageException("Could not initialize storage location", e);
        }
    }

    public String storeFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        log.debug("Starting file storage process for file: {}", fileName);

        try {
            validateFile(file);
            log.debug("File validation passed: {}", fileName);

            // Все изображения — в одну папку "images"
            Path targetDir = rootLocation.resolve("images").normalize();
            if (!Files.exists(targetDir)) {
                log.debug("Creating target directory: {}", targetDir);
                Files.createDirectories(targetDir);
            }

            String newFileName = UUID.randomUUID().toString() + getFileExtension(fileName);
            Path filePath = targetDir.resolve(newFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String result = "images/" + newFileName;
            log.info("File successfully stored: {}, size: {} bytes", result, file.getSize());
            return result;
        } catch (IOException e) {
            log.error("Storage failure for file: {}, reason: {}", fileName, e.getMessage(), e);
            throw new StorageException("Failed to store file " + fileName, e);
        }
    }


    public Resource loadFileAsResource(String filePath) {
        try {
            Path file = rootLocation.resolve(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists()) {
                throw new FileNotFoundException("File not found: " + filePath);
            }

            return resource;
        } catch (MalformedURLException | FileNotFoundException e) {
            throw new StorageException("File not found: " + filePath, e);
        }
    }

    public void deleteFile(String filePath) {
        try {
            Path file = rootLocation.resolve(filePath).normalize();
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file: " + filePath, e);
        }
    }

    private void validateFile(MultipartFile file) {
        if(file.isEmpty()){
            throw new InvalidFileException("File is empty");
        }

        if((file.getSize() > maxFileSize)){
            throw new InvalidFileException("File is too large");
        }

        String contentType = file.getContentType();
        if(contentType == null || !allowedTypes.contains(contentType)){
            throw new InvalidFileException("File type not allowed. Allowed types: " + String.join(", ", allowedTypes));
        }
    }

    private String getFileExtension(String filename) {

        if(filename == null) return "";
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex);
    }

    public String buildFileUrl(String filePath){
        String normalizedPath = filePath.replace("\\", "/");
        return baseUrl + "/api/v1/files/" + normalizedPath;
    }
}
