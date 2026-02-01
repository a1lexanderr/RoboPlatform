package com.example.demo.product.controller;

import com.example.demo.product.dto.ProductCreateDTO;
import com.example.demo.product.dto.ProductDTO;
import com.example.demo.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> create(
            @RequestPart("productData") @Valid ProductCreateDTO productDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Principal principal) {

        return ResponseEntity.ok(productService.createProduct(productDto, images, principal.getName()));
    }
}
