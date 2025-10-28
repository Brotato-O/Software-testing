-- Script tạo database TEST và cấp quyền cho user hbstudent

-- Tạo database
CREATE DATABASE IF NOT EXISTS test CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Tạo user và cấp quyền
CREATE USER IF NOT EXISTS 'hbstudent'@'localhost' IDENTIFIED BY 'hbstudent';
GRANT ALL PRIVILEGES ON test.* TO 'hbstudent'@'localhost';
FLUSH PRIVILEGES;

-- Sử dụng database
USE test;

-- Tạo bảng products (Spring Boot sẽ tự tạo, nhưng tạo sẵn cũng được)
CREATE TABLE IF NOT EXISTS products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  description VARCHAR(256),
  price DOUBLE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Thêm dữ liệu mẫu
INSERT INTO products (name, description, price) VALUES
('Laptop Dell XPS 13', 'Laptop cao cấp, màn hình 13 inch', 1299.99),
('iPhone 15 Pro', 'Điện thoại thông minh mới nhất', 999.99),
('Samsung Galaxy S24', 'Flagship Android phone', 849.99);

-- Kiểm tra
SELECT * FROM products;
SHOW TABLES;
