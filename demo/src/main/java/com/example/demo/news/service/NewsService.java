package com.example.demo.news.service;

import com.example.demo.common.exception.business.ResourceNotFoundException;
import com.example.demo.common.service.FileStorageService;
import com.example.demo.news.domain.NewsArticle;
import com.example.demo.news.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsArticleRepository newsRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<NewsArticle> getAllNews() {
        return newsRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public NewsArticle getNewsById(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found"));
    }

    @Transactional
    public NewsArticle createNews(String title, String excerpt, String content, MultipartFile imageFile) {
        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            String filePath = fileStorageService.storeFile(imageFile);
            imageUrl = fileStorageService.buildFileUrl(filePath);
        }

        NewsArticle article = NewsArticle.builder()
                .title(title)
                .excerpt(excerpt)
                .content(content)
                .imageUrl(imageUrl)
                .build();

        return newsRepository.save(article);
    }
    
    @Transactional
    public NewsArticle updateNews(Long id, String title, String excerpt, String content, MultipartFile imageFile) {
        NewsArticle article = getNewsById(id);

        article.setTitle(title);
        article.setExcerpt(excerpt);
        article.setContent(content);

        if (imageFile != null && !imageFile.isEmpty()) {
            if (article.getImageUrl() != null) {

            }
            String filePath = fileStorageService.storeFile(imageFile);
            article.setImageUrl(fileStorageService.buildFileUrl(filePath));
        }

        return newsRepository.save(article);
    }

    @Transactional
    public void deleteNews(Long id) {
        NewsArticle article = getNewsById(id);
        newsRepository.delete(article);
        log.info("News article with id {} deleted", id);
    }
}