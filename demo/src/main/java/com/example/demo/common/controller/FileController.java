package com.example.demo.common.controller;

import com.example.demo.common.dto.ImageDTO;
import com.example.demo.common.exception.technical.StorageException;
import com.example.demo.common.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {
    private final FileStorageService fileStorageService;

    @GetMapping("/**")
    public ResponseEntity<Resource> serveFile(HttpServletRequest request) {
        String fullPath = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String pattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);

        String filePath = new AntPathMatcher().extractPathWithinPattern(pattern, fullPath);
        log.info("Serving filePath: {}", filePath);

        try {
            Resource file = fileStorageService.loadFileAsResource(filePath);

            if (file == null || !file.exists()) {
                log.warn("File not found: {}", filePath);
                return ResponseEntity.notFound().build();
            }

            String contentType = request.getServletContext().getMimeType(file.getFile().getAbsolutePath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                    .body(file);

        } catch (StorageException e) {  // Добавляем обработку StorageException
            log.error("Storage error while serving file {}: {}", filePath, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            log.error("IO error while serving file {}: {}", filePath, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {  // Ловим все остальные исключения
            log.error("Unexpected error while serving file {}: {}", filePath, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}