# Câu 1.2.2: Thiết kế Test Cases Chi tiết cho Product (5 điểm)

**Trường Đại học Sài Gòn**  
**Khoa Công Nghệ Thông Tin**

---

## Yêu cầu

Thiết kế **5 test cases quan trọng nhất** cho chức năng Product Management theo template chuẩn Software Testing.

---

## Test Case 1: Tạo Sản phẩm Mới Thành công

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_PRODUCT_001 |
| **Test Name** | Tạo sản phẩm mới thành công |
| **Priority** | Critical |
| **Preconditions** | - User đã đăng nhập<br>- User có quyền tạo sản phẩm<br>- Application is running<br>- User is on Product page (http://localhost:3000/products) |
| **Test Steps** | 1. Navigate to Product page<br>2. Click "Add New Product" button<br>3. Enter product name: "Laptop Dell"<br>4. Enter price: 15000000<br>5. Enter quantity: 10<br>6. Select category: "Electronics"<br>7. Enter description (optional): "High-performance laptop"<br>8. Click "Save" button<br>9. Observe the result |
| **Test Data** | **Name:** Laptop Dell<br>**Price:** 15000000<br>**Quantity:** 10<br>**Category:** Electronics<br>**Description:** High-performance laptop |
| **Expected Result** | ✅ Success message displayed: "Product created successfully"<br>✅ HTTP Status: 201 Created<br>✅ Product saved to database with auto-generated ID<br>✅ Redirect to product list page<br>✅ New product appears in the list with correct data |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: Đây là core CRUD functionality - CREATE operation. Nếu không tạo được product, hệ thống quản lý sản phẩm không hoạt động.
- **Impact**: Blocking cho toàn bộ inventory management.

---

## Test Case 2: Cập nhật Sản phẩm Thành công

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_PRODUCT_002 |
| **Test Name** | Cập nhật thông tin sản phẩm thành công |
| **Priority** | Critical |
| **Preconditions** | - User đã đăng nhập<br>- User có quyền chỉnh sửa sản phẩm<br>- Product với tên "Laptop Dell" (ID = 100) đã tồn tại trong database<br>- Application is running |
| **Test Steps** | 1. Navigate to Product page<br>2. Locate product "Laptop Dell" in the list<br>3. Click "Edit" button for that product<br>4. Change price from 15000000 to 14000000<br>5. Change quantity from 10 to 8<br>6. Click "Update" button<br>7. Observe the result |
| **Test Data** | **Product ID:** 100<br>**Original Price:** 15000000<br>**New Price:** 14000000<br>**Original Quantity:** 10<br>**New Quantity:** 8 |
| **Expected Result** | ✅ Success message displayed: "Product updated successfully"<br>✅ HTTP Status: 200 OK<br>✅ Product updated in database<br>✅ Redirect to product list<br>✅ Updated price and quantity displayed correctly<br>✅ Other fields (Name, Category, Description) remain unchanged |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: UPDATE operation là critical cho việc quản lý giá và inventory. Cần update khi có discount hoặc nhập hàng.
- **Impact**: High business value - ảnh hưởng đến pricing và stock management.

---

## Test Case 3: Xóa Sản phẩm Thành công

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_PRODUCT_003 |
| **Test Name** | Xóa sản phẩm thành công |
| **Priority** | Critical |
| **Preconditions** | - User đã đăng nhập<br>- User có quyền xóa sản phẩm<br>- Product với ID = 101 tồn tại trong database<br>- Product không có orders liên quan (để có thể xóa)<br>- Application is running |
| **Test Steps** | 1. Navigate to Product page<br>2. Locate product with ID = 101<br>3. Click "Delete" button<br>4. Confirmation dialog appears: "Are you sure you want to delete this product?"<br>5. Click "Confirm" button<br>6. Observe the result |
| **Test Data** | **Product ID:** 101 |
| **Expected Result** | ✅ Success message displayed: "Product deleted successfully"<br>✅ HTTP Status: 200 OK or 204 No Content<br>✅ Product removed from database<br>✅ Product no longer appears in product list<br>✅ Page refreshes to show updated list |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: DELETE operation critical cho data management. Cần xóa được products discontinued hoặc nhập nhầm.
- **Impact**: Data management critical. Cần verify không xóa nhầm và handle cascade delete properly.

---

## Test Case 4: Xem Danh sách Sản phẩm

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_PRODUCT_004 |
| **Test Name** | Xem danh sách sản phẩm thành công |
| **Priority** | High |
| **Preconditions** | - User đã đăng nhập (or accessible publicly depending on design)<br>- Database có ít nhất 1 product<br>- Application is running |
| **Test Steps** | 1. Navigate to Product page (/products)<br>2. Observe the product list loading<br>3. Verify all products displayed<br>4. Check pagination (if available)<br>5. Test search/filter functionality (if available) |
| **Test Data** | N/A (reads existing products from database) |
| **Expected Result** | ✅ HTTP Status: 200 OK for GET /api/products<br>✅ Product list displayed in table/grid format<br>✅ Show columns: ID, Name, Price, Quantity, Category<br>✅ Actions (Edit, Delete) visible for each product<br>✅ Pagination works correctly (if applicable)<br>✅ Search/filter works (if applicable) |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: READ List operation - user phải xem được danh sách products để quản lý. Nếu fail, không thể navigate trong hệ thống.
- **Impact**: User experience critical - cần verify performance với nhiều products.

---

## Test Case 5: Xem Chi tiết Sản phẩm

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_PRODUCT_005 |
| **Test Name** | Xem chi tiết sản phẩm thành công |
| **Priority** | High |
| **Preconditions** | - User đã đăng nhập (if required)<br>- Product với ID = 100 tồn tại trong database<br>- Application is running |
| **Test Steps** | 1. Navigate to Product page<br>2. Locate product with ID = 100<br>3. Click on product name or "View Details" button<br>4. Observe the product detail page loading |
| **Test Data** | **Product ID:** 100 |
| **Expected Result** | ✅ HTTP Status: 200 OK for GET /api/products/100<br>✅ Product detail page displays all information:<br>&nbsp;&nbsp;&nbsp;- Name<br>&nbsp;&nbsp;&nbsp;- Price (formatted with commas)<br>&nbsp;&nbsp;&nbsp;- Quantity<br>&nbsp;&nbsp;&nbsp;- Description<br>&nbsp;&nbsp;&nbsp;- Category<br>✅ Show metadata: Created Date, Last Updated Date<br>✅ Back button navigates to product list |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: READ Detail operation - user cần xem đầy đủ thông tin product để đưa ra quyết định (edit, delete, etc).
- **Impact**: Important for decision making and user experience.

---

## Test Execution Summary

| Priority | Test Cases | Count |
|----------|------------|-------|
| **Critical** | TC_PRODUCT_001, TC_PRODUCT_002, TC_PRODUCT_003 | 3 |
| **High** | TC_PRODUCT_004, TC_PRODUCT_005 | 2 |
| **Total** | | **5** |

---

## Test Coverage Analysis

### Loại Test Coverage

| Loại Test | Test Cases | Coverage |
|-----------|------------|----------|
| **Happy Path (CRUD)** | TC_PRODUCT_001, TC_PRODUCT_002, TC_PRODUCT_003, TC_PRODUCT_004, TC_PRODUCT_005 | ✅ Covered |
| **CREATE Operation** | TC_PRODUCT_001 | ✅ Covered |
| **READ Operations** | TC_PRODUCT_004 (List), TC_PRODUCT_005 (Detail) | ✅ Covered |
| **UPDATE Operation** | TC_PRODUCT_002 | ✅ Covered |
| **DELETE Operation** | TC_PRODUCT_003 | ✅ Covered |

### Validation Rules Coverage

| Validation Rule | Test Cases | Status |
|-----------------|------------|--------|
| Product Name required (3-100 chars) | TC_PRODUCT_001 | ✅ Covered |
| Price required (> 0, <= 999,999,999) | TC_PRODUCT_001 | ✅ Covered |
| Quantity required (>= 0, <= 99,999) | TC_PRODUCT_001 | ✅ Covered |
| Category required | TC_PRODUCT_001 | ✅ Covered |
| CRUD operations | TC_PRODUCT_001, TC_PRODUCT_002, TC_PRODUCT_003, TC_PRODUCT_004, TC_PRODUCT_005 | ✅ Covered |

---

## Traceability Matrix

Mapping Test Cases to Requirements:

| Requirement | Test Cases | Status |
|-------------|------------|--------|
| **REQ-PRODUCT-001**: User phải tạo được product mới với thông tin hợp lệ | TC_PRODUCT_001 | ✅ |
| **REQ-PRODUCT-002**: User phải update được thông tin product | TC_PRODUCT_002 | ✅ |
| **REQ-PRODUCT-003**: User phải xóa được product không cần thiết | TC_PRODUCT_003 | ✅ |
| **REQ-PRODUCT-004**: User phải xem được danh sách products | TC_PRODUCT_004 | ✅ |
| **REQ-PRODUCT-005**: User phải xem được chi tiết product | TC_PRODUCT_005 | ✅ |

---

## Prerequisites for Test Execution

### Environment Setup:
1. ✅ Backend server running on `http://localhost:8080`
2. ✅ Frontend application running on `http://localhost:3000`
3. ✅ MySQL database "test" is running with credentials: hbstudent/hbstudent
4. ✅ Test user account created with product management permissions
5. ✅ Database has products table with proper schema

### Test Data Setup (SQL):
```sql
-- Create test products for READ operations
INSERT INTO products (name, price, quantity, description, category) 
VALUES 
  ('Laptop Dell', 15000000, 10, 'High-performance laptop', 'Electronics'),
  ('Test Product for Delete', 5000000, 5, 'Will be deleted', 'Electronics');

-- Verify products
SELECT * FROM products;
```

### Tools Required:
- Browser: Chrome/Edge (latest version)
- Browser DevTools (Network tab for HTTP status, Console for errors)
- Screenshot tool for test evidences
- Test management tool: Excel/Google Sheets hoặc TestRail
- SQL client (MySQL Workbench, DBeaver) to verify database changes

---

## Execution Order (by Priority)

**Critical Priority First (Must Pass):**
1. TC_PRODUCT_001 → CREATE operation (core CRUD)
2. TC_PRODUCT_002 → UPDATE operation (business critical)
3. TC_PRODUCT_003 → DELETE operation (data management)

**High Priority:**
4. TC_PRODUCT_004 → READ List (user navigation)
5. TC_PRODUCT_005 → READ Detail (user information)

---

## Pass/Fail Criteria

### Pass Criteria:
- **Critical tests (3 cases)**: MUST be 100% pass
- **High tests (2 cases)**: At least 80% pass (minimum 1/2 must pass)
- **Overall**: >= 80% pass rate (minimum 4/5 tests)

### Fail Criteria:
- If ANY Critical test fails → **STOP RELEASE**
- If both High tests fail → Major defect, requires fix
- If <= 60% pass rate → Regression required

---

## Test Metrics

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 5 |
| **Estimated Execution Time** | 20-25 minutes |
| **Pass Criteria** | >= 80% (4/5 tests) |
| **Critical Tests** | 3 (must be 100% pass) |
| **Coverage** | Complete CRUD operations |

---

## Defect Severity Classification

| Severity | Description | Example |
|----------|-------------|---------|
| **Critical** | CRUD operation fails, Data loss, Cannot create/update/delete | TC_PRODUCT_001/002/003 fails |
| **High** | Validation not working, Cannot view products, Wrong data displayed | TC_PRODUCT_004/005 fails |
| **Medium** | UI issues, Inconsistent behavior, Performance issues | Slow loading, pagination broken |
| **Low** | Cosmetic issues, Typos, Alignment problems | Button color, text alignment |

---

**Document Information:**

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Created Date** | October 29, 2025 |
| **Last Updated** | October 29, 2025 |
| **Author** | QA Team - Software Testing Course |
| **Status** | ✅ Ready for Execution |
| **Approved By** | *(To be filled)* |

---

## Ghi chú cho Giảng viên

**Lý do chọn 5 test cases này:**

1. **TC_PRODUCT_001** (Critical): CREATE operation - chức năng cơ bản nhất của Product Management. Không tạo được product = hệ thống vô dụng.
2. **TC_PRODUCT_002** (Critical): UPDATE operation - cần thiết cho việc quản lý giá và inventory. Business critical.
3. **TC_PRODUCT_003** (Critical): DELETE operation - quan trọng cho data management và cleanup.
4. **TC_PRODUCT_004** (High): READ List - user cần xem danh sách để navigate và quản lý products.
5. **TC_PRODUCT_005** (High): READ Detail - cần xem đầy đủ thông tin để đưa ra quyết định.

**Coverage:**
- ✅ Happy Path (CRUD): 5 cases
- ✅ CREATE: 1 case
- ✅ READ: 2 cases (List + Detail)
- ✅ UPDATE: 1 case
- ✅ DELETE: 1 case

**Priority Distribution:**
- Critical: 3 cases (60%) - CRUD core operations
- High: 2 cases (40%) - READ operations

**So sánh với Login Testing:**
- Login: 5 test cases (1 operation với nhiều validation scenarios)
- Product: 5 test cases (5 CRUD operations - mỗi operation 1 happy path test)
- Product phức tạp hơn vì có nhiều operations và nhiều fields hơn (5 fields vs 2 fields)
