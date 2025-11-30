-- ===================================================
-- Setup Database TEST - Software Testing Assignment
-- ===================================================
-- Database: test
-- User: hbstudent / hbstudent
-- Tables: users, products
-- ===================================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS test CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Tạo user và cấp quyền
CREATE USER IF NOT EXISTS 'hbstudent'@'localhost' IDENTIFIED BY 'hbstudent';
GRANT ALL PRIVILEGES ON test.* TO 'hbstudent'@'localhost';
FLUSH PRIVILEGES;

-- Sử dụng database
USE test;

-- ===================================================
-- Bảng USERS - Cho login authentication
-- ===================================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Thêm dữ liệu test users
-- Note: Password plain text (trong thực tế nên hash)
INSERT INTO users (username, password) VALUES
('testuser', 'Test123'),
('admin', 'Admin123'),
('john.doe', 'John123');

-- ===================================================
-- Bảng PRODUCTS - Cho product CRUD
-- ===================================================
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  description VARCHAR(256),
  price DOUBLE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Thêm dữ liệu mẫu products
INSERT INTO products (name, description, price) VALUES
('Laptop Dell XPS 13', 'Laptop cao cấp, màn hình 13 inch', 1299.99),
('iPhone 15 Pro', 'Điện thoại thông minh mới nhất', 999.99),
('Samsung Galaxy S24', 'Flagship Android phone', 849.99);

-- ===================================================
-- Kiểm tra dữ liệu
-- ===================================================
SELECT 'USERS TABLE:' as '';
SELECT * FROM users;

SELECT 'PRODUCTS TABLE:' as '';
SELECT * FROM products;

SELECT 'ALL TABLES:' as '';
SHOW TABLES;
