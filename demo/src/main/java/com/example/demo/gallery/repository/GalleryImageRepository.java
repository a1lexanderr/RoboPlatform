package com.example.demo.gallery.repository;

import com.example.demo.gallery.domain.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
}