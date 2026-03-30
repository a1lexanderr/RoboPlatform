package com.example.demo.gallery.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gallery_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    // Путь на диске (нужен, чтобы физически удалять файл при удалении из БД)
    @Column(name = "file_path", nullable = false)
    private String filePath;

    // Готовый URL для фронтенда
    @Column(name = "url", nullable = false)
    private String url;
}