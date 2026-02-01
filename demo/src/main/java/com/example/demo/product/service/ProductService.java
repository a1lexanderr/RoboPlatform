package com.example.demo.product.service;

import com.example.demo.common.Image;
import com.example.demo.common.service.ImageService;
import com.example.demo.product.domain.Product;
import com.example.demo.product.domain.ProductCategory;
import com.example.demo.product.dto.ProductCreateDTO;
import com.example.demo.product.dto.ProductDTO;
import com.example.demo.product.repository.ProductRepository;
import com.example.demo.user.domain.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ImageService imageService;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .toList(); // Java 17 feature
    }

    @Transactional
    public ProductDTO createProduct(ProductCreateDTO dto, List<MultipartFile> files, String username) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductCategory categoryEnum = ProductCategory.valueOf(dto.category());
        Product product = Product.builder()
                .title(dto.title())
                .description(dto.description())
                .price(dto.price())
                .stockQuantity(dto.stockQuantity())
                .category(categoryEnum)
                .seller(seller)
                .build();

        if (files != null && !files.isEmpty()) {
            boolean isFirst = true;

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    Image image = imageService.saveImage(
                            file,
                            product.getTitle() + (isFirst ? " Main" : ""),
                            isFirst,
                            "product"
                    );

                    product.getImages().add(image);
                    isFirst = false;
                }
            }
        }

        return mapToDto(productRepository.save(product));
    }

    private ProductDTO mapToDto(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                (product.getCategory() != null) ? product.getCategory().name() : null,
                product.getSeller().getUsername(),
                product.getImages().stream().map(Image::getUrl).toList()
        );
    }
}