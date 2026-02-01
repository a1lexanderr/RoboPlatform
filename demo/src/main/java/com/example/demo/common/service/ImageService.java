package com.example.demo.common.service;

import com.example.demo.common.Image;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    Image saveImage(MultipartFile file, String title, boolean isMain, String entityType);
    void deleteImage(Long id);
    Image updateImage(Long imageId, MultipartFile newFile, String newTitle, Boolean isMain);
    Image findImageById(Long id);
}
