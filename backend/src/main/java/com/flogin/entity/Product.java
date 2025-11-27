package com.flogin.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
        public Product() {}

        public Product(Long id, String name, Double price, Integer quantity, String category) {
            this.id = id;
            this.name = name;
            this.price = price;
            this.category = category;
        }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private String category;

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}
