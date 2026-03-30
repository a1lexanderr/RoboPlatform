package com.example.demo.news.controller;

import com.example.demo.news.dto.NewsArticleDTO;
import com.example.demo.news.domain.NewsArticle;
import com.example.demo.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    private NewsArticleDTO toDto(NewsArticle article) {
        return new NewsArticleDTO(
                article.getId(),
                article.getTitle(),
                article.getExcerpt(),
                article.getContent(),
                article.getImageUrl(),
                article.getCreatedAt()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleDTO> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(toDto(newsService.getNewsById(id)));
    }

    @GetMapping
    public ResponseEntity<List<NewsArticleDTO>> getAllNews() {
        List<NewsArticleDTO> news = newsService.getAllNews().stream().map(this::toDto).toList();
        return ResponseEntity.ok(news);
    }

    @PostMapping
    public ResponseEntity<NewsArticleDTO> createNews(
            @RequestParam("title") String title,
            @RequestParam("excerpt") String excerpt,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        NewsArticle saved = newsService.createNews(title, excerpt, content, image);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticleDTO> updateNews(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("excerpt") String excerpt,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        NewsArticle updated = newsService.updateNews(id, title, excerpt, content, image);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}