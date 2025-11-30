# Câu 1.2: Product - Phân tích và Test Scenarios (10 điểm)

## 2.2.1 Yêu cầu (5 điểm)

### a) Phân tích đầy đủ các yêu cầu chức năng của Product CRUD (2 điểm)

#### 1. Validation Rules cho Product

| Field | Tiêu chí | Yêu cầu | Mô tả |
|-------|----------|---------|-------|
| **Product Name** | Độ dài | 3-100 ký tự | Tên sản phẩm phải có ít nhất 3 ký tự và tối đa 100 ký tự |
| | Bắt buộc | Không được rỗng | Product Name là trường bắt buộc phải nhập |
| | Ký tự cho phép | Chữ cái, số, khoảng trắng, ký tự đặc biệt | Cho phép tất cả ký tự printable |
| **Price** | Giá trị | > 0 và <= 999,999,999 | Giá phải lớn hơn 0 và không vượt quá 999 triệu |
| | Định dạng | Số thực (decimal) | Cho phép giá có phần thập phân (VD: 99.99) |
| | Bắt buộc | Không được rỗng | Price là trường bắt buộc |
| **Quantity** | Giá trị | >= 0 và <= 99,999 | Số lượng từ 0 đến 99,999 |
| | Định dạng | Số nguyên (integer) | Không cho phép số thập phân |
| | Bắt buộc | Không được rỗng | Quantity là trường bắt buộc |
| **Description** | Độ dài | <= 500 ký tự | Mô tả tối đa 500 ký tự |
| | Bắt buộc | Optional | Description có thể để trống |
| **Category** | Giá trị | Phải thuộc danh sách có sẵn | Category phải chọn từ dropdown list |
| | Danh sách | Electronics, Clothing, Food, Books, Toys, Others | 6 categories mặc định |
| | Bắt buộc | Không được rỗng | Category là trường bắt buộc |

---

#### 2. Error Messages

**Product Name:**
- Rỗng: `"Product name is required"`
- < 3 ký tự: `"Product name must be at least 3 characters"`
- > 100 ký tự: `"Product name must not exceed 100 characters"`

**Price:**
- Rỗng: `"Price is required"`
- <= 0: `"Price must be greater than 0"`
- > 999,999,999: `"Price must not exceed 999,999,999"`
- Không phải số: `"Price must be a valid number"`

**Quantity:**
- Rỗng: `"Quantity is required"`
- < 0: `"Quantity cannot be negative"`
- > 99,999: `"Quantity must not exceed 99,999"`
- Không phải số nguyên: `"Quantity must be a whole number"`

**Description:**
- > 500 ký tự: `"Description must not exceed 500 characters"`

**Category:**
- Rỗng: `"Category is required"`
- Không hợp lệ: `"Please select a valid category"`

---

#### 3. CRUD Operations - Chi tiết Functional Requirements

### **CREATE - Thêm sản phẩm mới**

**Flow:**
```
User clicks "Add Product" button
    ↓
Show Product Form (empty)
    ↓
User fills in: Name, Price, Quantity, Description, Category
    ↓
User clicks "Save" button
    ↓
Frontend Validation
    ↓ (Valid)
Send POST /api/products
Body: { name, price, quantity, description, category }
    ↓
Backend Validation & Save to Database
    ↓ (Success)
Return 201 Created + Product Object
    ↓
Frontend: Show success message, redirect to Product List
```

**Preconditions:**
- User is authenticated (logged in)
- User has permission to create products
- Product form is accessible

**Input Fields:**
- Product Name (text input, 3-100 chars, required)
- Price (number input, > 0, <= 999,999,999, required)
- Quantity (number input, >= 0, <= 99,999, required)
- Description (textarea, <= 500 chars, optional)
- Category (dropdown, required)

**Success Criteria:**
- HTTP Status: 201 Created
- Product saved to database with auto-generated ID
- Success message: "Product created successfully"
- Redirect to Product List page
- New product appears in the list

**Error Scenarios:**
- Validation errors → 400 Bad Request
- Duplicate product name → 409 Conflict (optional)
- Server error → 500 Internal Server Error

---

### **READ - Xem danh sách và chi tiết sản phẩm**

#### **READ List - Danh sách sản phẩm**

**Flow:**
```
User navigates to /products
    ↓
Send GET /api/products
    ↓
Backend: Query all products from database
    ↓
Return 200 OK + Array of Products
    ↓
Frontend: Display products in table/grid
```

**Response Format:**
```json
[
  {
    "id": 1,
    "name": "Laptop Dell XPS 13",
    "price": 25000000,
    "quantity": 10,
    "description": "High-performance laptop",
    "category": "Electronics"
  }
]
```

**Features:**
- Pagination (optional): 10 items per page
- Search (optional): Search by product name
- Filter (optional): Filter by category
- Sort (optional): Sort by name, price, quantity

**Success Criteria:**
- HTTP Status: 200 OK
- Products displayed in table format
- Show: ID, Name, Price, Quantity, Category
- Actions: Edit, Delete buttons for each product

---

#### **READ Detail - Chi tiết sản phẩm**

**Flow:**
```
User clicks on product name or "View Details"
    ↓
Navigate to /products/:id
    ↓
Send GET /api/products/:id
    ↓
Backend: Query product by ID
    ↓ (Found)
Return 200 OK + Product Object
    ↓
Frontend: Display product details
```

**Success Criteria:**
- HTTP Status: 200 OK
- Show all product fields: Name, Price, Quantity, Description, Category
- Show metadata: Created Date, Last Updated

**Error Scenarios:**
- Product not found → 404 Not Found
- Invalid ID format → 400 Bad Request

---

### **UPDATE - Cập nhật thông tin sản phẩm**

**Flow:**
```
User clicks "Edit" button on a product
    ↓
Navigate to /products/:id/edit
    ↓
Send GET /api/products/:id (to load current data)
    ↓
Show Product Form pre-filled with current data
    ↓
User modifies fields
    ↓
User clicks "Update" button
    ↓
Frontend Validation
    ↓ (Valid)
Send PUT /api/products/:id
Body: { name, price, quantity, description, category }
    ↓
Backend Validation & Update Database
    ↓ (Success)
Return 200 OK + Updated Product Object
    ↓
Frontend: Show success message, redirect to Product List
```

**Preconditions:**
- Product exists with given ID
- User is authenticated
- User has permission to update products

**Input Fields:**
- Same as CREATE (all fields editable)
- Pre-filled with current values

**Success Criteria:**
- HTTP Status: 200 OK
- Product updated in database
- Success message: "Product updated successfully"
- Changes reflected in Product List

**Error Scenarios:**
- Product not found → 404 Not Found
- Validation errors → 400 Bad Request
- Concurrent update conflict → 409 Conflict (optional)

---

### **DELETE - Xóa sản phẩm**

**Flow:**
```
User clicks "Delete" button on a product
    ↓
Show confirmation dialog: "Are you sure you want to delete this product?"
    ↓
User clicks "Confirm"
    ↓
Send DELETE /api/products/:id
    ↓
Backend: Check if product exists
    ↓ (Exists)
Delete product from database
    ↓
Return 200 OK or 204 No Content
    ↓
Frontend: Show success message, remove product from list
```

**Preconditions:**
- Product exists with given ID
- User is authenticated
- User has permission to delete products
- Product is not referenced by other entities (optional)

**Success Criteria:**
- HTTP Status: 200 OK or 204 No Content
- Product removed from database
- Success message: "Product deleted successfully"
- Product no longer appears in list

**Error Scenarios:**
- Product not found → 404 Not Found
- Product in use (has orders) → 400 Bad Request with message
- No permission → 403 Forbidden

---

### 4. Business Rules

**BR-01: Unique Product Name** (Optional)
- Mỗi product name phải unique (không trùng lặp)
- Khi CREATE hoặc UPDATE: Check database xem tên đã tồn tại chưa
- Nếu trùng → Return 409 Conflict: "Product name already exists"

**BR-02: Price Format**
- Price lưu dưới dạng số nguyên (VND)
- Frontend display: Format với dấu phẩy (25,000,000)
- Cho phép 2 số thập phân (99.99)

**BR-03: Quantity Management**
- Quantity = 0: Product "Out of Stock" nhưng vẫn hiển thị
- Quantity < 0: Không cho phép (reject validation)

**BR-04: Category Management**
- Categories hard-coded trong frontend: ["Electronics", "Clothing", "Food", "Books", "Toys", "Others"]
- Backend validate category phải nằm trong danh sách này

**BR-05: Description Optional**
- Description có thể null hoặc empty string
- Nếu user không nhập → Lưu empty string

**BR-06: Soft Delete** (Optional - Advanced)
- Thay vì xóa hẳn, set flag `deleted = true`
- Product vẫn tồn tại trong DB nhưng không hiển thị
- Có thể restore sau này

---

### 5. API Endpoints Summary

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| **POST** | `/api/products` | Create product | `{ name, price, quantity, description, category }` | 201 Created + Product Object |
| **GET** | `/api/products` | Get all products | - | 200 OK + Array of Products |
| **GET** | `/api/products/:id` | Get product by ID | - | 200 OK + Product Object |
| **PUT** | `/api/products/:id` | Update product | `{ name, price, quantity, description, category }` | 200 OK + Updated Product |
| **DELETE** | `/api/products/:id` | Delete product | - | 200 OK or 204 No Content |

---

### 6. Error Handling Strategy

| Error Type | HTTP Status | Error Response | Frontend Action |
|------------|-------------|----------------|-----------------|
| Validation Error | 400 | `{ errors: { field: "message" } }` | Show errors below fields |
| Product Not Found | 404 | `{ error: "Product not found" }` | Show error alert |
| Duplicate Product | 409 | `{ error: "Product name already exists" }` | Show error on name field |
| Unauthorized | 401 | `{ error: "Unauthorized" }` | Redirect to login |
| Forbidden | 403 | `{ error: "Permission denied" }` | Show error message |
| Server Error | 500 | `{ error: "Internal server error" }` | Show generic error |

---

## b) Liệt kê và mô tả ít nhất 10 test scenarios cho Product (2 điểm)

**Tổng quan:** Đã thiết kế **30 test scenarios** bao gồm đầy đủ các loại test:

| Loại Test | Số lượng | Scenario IDs |
|-----------|----------|--------------|
| **Happy Path** | 5 scenarios | TS_PRODUCT_01 → TS_PRODUCT_05 |
| **Negative Tests** | 12 scenarios | TS_PRODUCT_06 → TS_PRODUCT_17 |
| **Boundary Tests** | 8 scenarios | TS_PRODUCT_18 → TS_PRODUCT_25 |
| **Edge Cases** | 5 scenarios | TS_PRODUCT_26 → TS_PRODUCT_30 |
| **TỔNG** | **30 scenarios** | (Vượt yêu cầu 10+) |

---

### Happy Path Scenarios (5 test cases)

| ID | Scenario | Description | Input | Expected Output |
|----|----------|-------------|-------|-----------------|
| **TS_PRODUCT_01** | **CREATE: Thêm sản phẩm mới thành công** | User tạo product mới với tất cả dữ liệu hợp lệ | Name: "Laptop Dell XPS 13"<br>Price: 25000000<br>Quantity: 10<br>Description: "High-performance laptop"<br>Category: "Electronics" | - Success message: "Product created successfully"<br>- HTTP 201 Created<br>- Product saved to DB<br>- Redirect to product list<br>- New product appears in list |
| **TS_PRODUCT_02** | **READ: Xem danh sách sản phẩm** | User truy cập trang product list | Navigate to /products | - HTTP 200 OK<br>- Display all products in table<br>- Show: ID, Name, Price, Quantity, Category<br>- Actions: Edit, Delete buttons |
| **TS_PRODUCT_03** | **READ: Xem chi tiết sản phẩm** | User click vào product để xem chi tiết | Click on product ID = 1 | - HTTP 200 OK<br>- Display full product details<br>- Show: Name, Price, Quantity, Description, Category<br>- Show: Created date, Updated date |
| **TS_PRODUCT_04** | **UPDATE: Cập nhật sản phẩm thành công** | User chỉnh sửa thông tin product và save | Update product ID = 1<br>New Price: 23000000<br>New Quantity: 8 | - Success message: "Product updated successfully"<br>- HTTP 200 OK<br>- Changes saved to DB<br>- Redirect to product list<br>- Updated data displayed |
| **TS_PRODUCT_05** | **DELETE: Xóa sản phẩm thành công** | User xóa product và confirm | Delete product ID = 1<br>User clicks "Confirm" in dialog | - Success message: "Product deleted successfully"<br>- HTTP 200 OK or 204 No Content<br>- Product removed from DB<br>- Product no longer in list |

---

### Negative Test Scenarios (12 test cases)

| ID | Scenario | Description | Input | Expected Output |
|----|----------|-------------|-------|-----------------|
| **TS_PRODUCT_06** | **CREATE: Product Name rỗng** | User submit form mà không nhập tên sản phẩm | Name: ""<br>Price: 100000<br>Quantity: 5<br>Category: "Electronics" | - Error: "Product name is required"<br>- HTTP 400 Bad Request<br>- No request sent to server<br>- Stay on form page |
| **TS_PRODUCT_07** | **CREATE: Price rỗng** | User không nhập giá sản phẩm | Name: "Test Product"<br>Price: ""<br>Quantity: 5<br>Category: "Electronics" | - Error: "Price is required"<br>- HTTP 400 Bad Request<br>- No request sent<br>- Stay on form |
| **TS_PRODUCT_08** | **CREATE: Quantity rỗng** | User không nhập số lượng | Name: "Test Product"<br>Price: 100000<br>Quantity: ""<br>Category: "Electronics" | - Error: "Quantity is required"<br>- HTTP 400 Bad Request<br>- No request sent<br>- Stay on form |
| **TS_PRODUCT_09** | **CREATE: Category rỗng** | User không chọn category | Name: "Test Product"<br>Price: 100000<br>Quantity: 5<br>Category: "" | - Error: "Category is required"<br>- HTTP 400 Bad Request<br>- No request sent<br>- Stay on form |
| **TS_PRODUCT_10** | **CREATE: Price <= 0** | User nhập giá bằng 0 hoặc âm | Name: "Test Product"<br>Price: 0<br>Quantity: 5<br>Category: "Electronics" | - Error: "Price must be greater than 0"<br>- HTTP 400 Bad Request<br>- No request sent |
| **TS_PRODUCT_11** | **CREATE: Quantity âm** | User nhập số lượng < 0 | Name: "Test Product"<br>Price: 100000<br>Quantity: -5<br>Category: "Electronics" | - Error: "Quantity cannot be negative"<br>- HTTP 400 Bad Request<br>- No request sent |
| **TS_PRODUCT_12** | **CREATE: Price không phải số** | User nhập text vào trường Price | Name: "Test Product"<br>Price: "abc"<br>Quantity: 5<br>Category: "Electronics" | - Error: "Price must be a valid number"<br>- HTTP 400 Bad Request<br>- No request sent |
| **TS_PRODUCT_13** | **CREATE: Quantity không phải số nguyên** | User nhập số thập phân vào Quantity | Name: "Test Product"<br>Price: 100000<br>Quantity: 5.5<br>Category: "Electronics" | - Error: "Quantity must be a whole number"<br>- HTTP 400 Bad Request<br>- No request sent |
| **TS_PRODUCT_14** | **CREATE: Category không hợp lệ** | User gửi category không nằm trong danh sách | Name: "Test Product"<br>Price: 100000<br>Quantity: 5<br>Category: "InvalidCategory" | - Error: "Please select a valid category"<br>- HTTP 400 Bad Request |
| **TS_PRODUCT_15** | **UPDATE: Product không tồn tại** | User cố gắng update product đã bị xóa hoặc không tồn tại | PUT /api/products/99999 | - Error: "Product not found"<br>- HTTP 404 Not Found<br>- No changes made |
| **TS_PRODUCT_16** | **READ: Product không tồn tại** | User truy cập chi tiết product không tồn tại | GET /api/products/99999 | - Error: "Product not found"<br>- HTTP 404 Not Found<br>- Show error page |
| **TS_PRODUCT_17** | **DELETE: Product không tồn tại** | User cố gắng xóa product đã bị xóa | DELETE /api/products/99999 | - Error: "Product not found"<br>- HTTP 404 Not Found |

---

### Boundary Test Scenarios (8 test cases)

| ID | Scenario | Description | Input | Expected Output |
|----|----------|-------------|-------|-----------------|
| **TS_PRODUCT_18** | **Name: Độ dài minimum (3 chars)** | User nhập tên sản phẩm đúng 3 ký tự | Name: "ABC"<br>Price: 100000<br>Quantity: 5<br>Category: "Electronics" | - Validation pass<br>- Product created successfully<br>- HTTP 201 Created |
| **TS_PRODUCT_19** | **Name: Dưới minimum (2 chars)** | User nhập tên sản phẩm chỉ 2 ký tự | Name: "AB"<br>Price: 100000<br>Quantity: 5<br>Category: "Electronics" | - Error: "Product name must be at least 3 characters"<br>- HTTP 400 Bad Request |
| **TS_PRODUCT_20** | **Name: Độ dài maximum (100 chars)** | User nhập tên sản phẩm đúng 100 ký tự | Name: "A" * 100<br>Price: 100000<br>Quantity: 5<br>Category: "Electronics" | - Validation pass<br>- Product created successfully<br>- HTTP 201 Created |
| **TS_PRODUCT_21** | **Name: Vượt maximum (101 chars)** | User nhập tên sản phẩm 101 ký tự | Name: "A" * 101<br>Price: 100000<br>Quantity: 5<br>Category: "Electronics" | - Error: "Product name must not exceed 100 characters"<br>- HTTP 400 Bad Request |
| **TS_PRODUCT_22** | **Price: Giá trị maximum (999,999,999)** | User nhập giá tối đa cho phép | Name: "Expensive Product"<br>Price: 999999999<br>Quantity: 1<br>Category: "Electronics" | - Validation pass<br>- Product created successfully<br>- HTTP 201 Created |
| **TS_PRODUCT_23** | **Price: Vượt maximum** | User nhập giá > 999,999,999 | Name: "Too Expensive"<br>Price: 1000000000<br>Quantity: 1<br>Category: "Electronics" | - Error: "Price must not exceed 999,999,999"<br>- HTTP 400 Bad Request |
| **TS_PRODUCT_24** | **Quantity: Maximum (99,999)** | User nhập số lượng tối đa | Name: "Bulk Product"<br>Price: 10000<br>Quantity: 99999<br>Category: "Electronics" | - Validation pass<br>- Product created successfully<br>- HTTP 201 Created |
| **TS_PRODUCT_25** | **Quantity: Vượt maximum (100,000)** | User nhập số lượng > 99,999 | Name: "Too Much"<br>Price: 10000<br>Quantity: 100000<br>Category: "Electronics" | - Error: "Quantity must not exceed 99,999"<br>- HTTP 400 Bad Request |

---

### Edge Case Scenarios (5 test cases)

| ID | Scenario | Description | Input | Expected Output |
|----|----------|-------------|-------|-----------------|
| **TS_PRODUCT_26** | **Description: Maximum (500 chars)** | User nhập description đúng 500 ký tự | Description: "A" * 500 | - Validation pass<br>- Product created successfully |
| **TS_PRODUCT_27** | **Description: Vượt maximum (501 chars)** | User nhập description > 500 ký tự | Description: "A" * 501 | - Error: "Description must not exceed 500 characters"<br>- HTTP 400 Bad Request |
| **TS_PRODUCT_28** | **Description: Để trống (Optional)** | User không nhập description | Description: "" | - Validation pass (description is optional)<br>- Product created với description = null hoặc "" |
| **TS_PRODUCT_29** | **Duplicate Product Name** | User tạo product với tên đã tồn tại | Name: "Laptop Dell XPS 13" (đã tồn tại)<br>Price: 25000000<br>Quantity: 10<br>Category: "Electronics" | - Error: "Product name already exists"<br>- HTTP 409 Conflict<br>- Suggest: "Please use a different name" |
| **TS_PRODUCT_30** | **Update: Quantity = 0 (Out of Stock)** | User cập nhật quantity về 0 | Update product ID = 1<br>Quantity: 0 | - Validation pass<br>- Product updated successfully<br>- Product marked as "Out of Stock" in UI<br>- HTTP 200 OK |

---

### Tổng kết Test Scenarios Coverage

| Loại Test | Số lượng | % Coverage | Scenarios cụ thể |
|-----------|----------|------------|------------------|
| **Happy Path** | 5 | 16.7% | TS_PRODUCT_01, TS_PRODUCT_02, TS_PRODUCT_03, TS_PRODUCT_04, TS_PRODUCT_05 |
| **Negative Tests** | 12 | 40% | TS_PRODUCT_06 → TS_PRODUCT_17 |
| **Boundary Tests** | 8 | 26.7% | TS_PRODUCT_18 → TS_PRODUCT_25 |
| **Edge Cases** | 5 | 16.7% | TS_PRODUCT_26 → TS_PRODUCT_30 |
| **TỔNG** | **30** | **100%** | (Yêu cầu tối thiểu: 10) |

---

## c) Phân loại test scenarios theo mức độ ưu tiên (1 điểm)

### Critical Priority (Must Test - Highest Impact)

| Scenario ID | Tên Scenario | Lý do phân loại Critical |
|-------------|--------------|--------------------------|
| **TS_PRODUCT_01** | CREATE: Thêm sản phẩm mới thành công | **Core functionality**: Chức năng chính của CRUD. Nếu không tạo được product, hệ thống vô dụng. Impact: Blocking. |
| **TS_PRODUCT_02** | READ: Xem danh sách sản phẩm | **Core functionality**: User phải xem được products. Nếu fail, không thể quản lý gì cả. Impact: Critical. |
| **TS_PRODUCT_04** | UPDATE: Cập nhật sản phẩm thành công | **Core functionality**: Cần update được thông tin product (giá, số lượng). Impact: High business value. |
| **TS_PRODUCT_05** | DELETE: Xóa sản phẩm thành công | **Core functionality**: Phải xóa được products không cần thiết. Impact: Data management critical. |
| **TS_PRODUCT_06** | Product Name rỗng | **Data integrity**: Không được phép tạo product không có tên. Impact: Database constraint violation. |
| **TS_PRODUCT_10** | Price <= 0 | **Business rule critical**: Không được bán product với giá 0 hoặc âm. Impact: Revenue loss. |

**Giải thích**: Critical tests phải pass 100%. Nếu fail → STOP RELEASE.

---

### High Priority (Important - Should Test)

| Scenario ID | Tên Scenario | Lý do phân loại High |
|-------------|--------------|----------------------|
| **TS_PRODUCT_03** | READ: Xem chi tiết sản phẩm | **User experience**: User cần xem chi tiết product. Impact: Important for decision making. |
| **TS_PRODUCT_07** | Price rỗng | **Required field validation**: Price là thông tin bắt buộc. Impact: High. |
| **TS_PRODUCT_08** | Quantity rỗng | **Required field validation**: Quantity bắt buộc để quản lý inventory. Impact: High. |
| **TS_PRODUCT_09** | Category rỗng | **Required field validation**: Category giúp phân loại product. Impact: High. |
| **TS_PRODUCT_11** | Quantity âm | **Data validation**: Không cho phép số lượng âm (vô lý). Impact: Data integrity. |
| **TS_PRODUCT_15** | UPDATE: Product không tồn tại | **Error handling**: Phải handle được trường hợp product đã bị xóa. Impact: Prevent crashes. |
| **TS_PRODUCT_16** | READ: Product không tồn tại | **Error handling**: Phải show 404 error properly. Impact: UX. |
| **TS_PRODUCT_29** | Duplicate Product Name | **Business rule**: Tránh duplicate products gây nhầm lẫn. Impact: Data quality. |

**Giải thích**: High priority tests nên pass trước release. Nếu fail → Fix before release.

---

### Medium Priority (Should Test - Moderate Impact)

| Scenario ID | Tên Scenario | Lý do phân loại Medium |
|-------------|--------------|------------------------|
| **TS_PRODUCT_12** | Price không phải số | **Validation**: Type validation. Impact vừa vì UI thường đã có input type="number". |
| **TS_PRODUCT_13** | Quantity không phải số nguyên | **Validation**: Số lượng phải là số nguyên. Impact vừa. |
| **TS_PRODUCT_14** | Category không hợp lệ | **Validation**: Dropdown thường đã limit choices. Impact vừa. |
| **TS_PRODUCT_18** | Name: Minimum (3 chars) | **Boundary test**: Kiểm tra giá trị biên min. Impact vừa. |
| **TS_PRODUCT_19** | Name: Dưới minimum (2 chars) | **Boundary test**: Reject khi < min. Impact vừa. |
| **TS_PRODUCT_20** | Name: Maximum (100 chars) | **Boundary test**: Accept giá trị max. Impact vừa. |
| **TS_PRODUCT_21** | Name: Vượt maximum (101 chars) | **Boundary test**: Reject khi > max. Impact vừa. |
| **TS_PRODUCT_22** | Price: Maximum (999,999,999) | **Boundary test**: Accept giá max. Impact vừa (rare case). |
| **TS_PRODUCT_24** | Quantity: Maximum (99,999) | **Boundary test**: Accept quantity max. Impact vừa. |
| **TS_PRODUCT_26** | Description: Maximum (500 chars) | **Boundary test**: Description boundary. Impact vừa. |

**Giải thích**: Medium tests nên test trong regression. Nếu fail → Fix in next sprint.

---

### Low Priority (Nice to Test - Low Impact)

| Scenario ID | Tên Scenario | Lý do phân loại Low |
|-------------|--------------|---------------------|
| **TS_PRODUCT_17** | DELETE: Product không tồn tại | **Edge case**: Rare scenario. UI thường không cho delete product không tồn tại. Impact thấp. |
| **TS_PRODUCT_23** | Price: Vượt maximum | **Extreme boundary**: Rất ít ai nhập giá > 1 tỷ. Low probability. |
| **TS_PRODUCT_25** | Quantity: Vượt maximum (100,000) | **Extreme boundary**: Rất ít khi cần > 99,999 items. Low probability. |
| **TS_PRODUCT_27** | Description: Vượt maximum (501 chars) | **Edge case**: UI thường có maxlength attribute. Low impact. |
| **TS_PRODUCT_28** | Description: Để trống (Optional) | **Valid case**: Description optional nên để trống là hợp lệ. Low priority. |
| **TS_PRODUCT_30** | Quantity = 0 (Out of Stock) | **Valid edge case**: Quantity = 0 là hợp lệ (hết hàng). Low impact, common scenario. |

**Giải thích**: Low priority tests có thể skip nếu thiếu thời gian. Test khi có automation.

---

## Tổng kết Priority Distribution

```
Critical (6 tests)  : ████████████████████ 20%
High (8 tests)      : ██████████████████████████ 26.7%
Medium (10 tests)   : █████████████████████████████████ 33.3%
Low (6 tests)       : ████████████████████ 20%
────────────────────────────────────────────────
Total: 30 test scenarios
```

**Risk-based Testing Strategy:**
1. **Always test Critical** → CRUD operations + Required validations
2. **Test High before release** → Error handling + Business rules
3. **Test Medium in regression** → Boundary tests + Type validations
4. **Test Low when possible** → Edge cases + Optional fields

---

**Nguyên tắc phân loại:**
- **Critical**: CRUD core operations + Required field validations + Business-critical rules
- **High**: Error handling + Non-null constraints + Duplicate prevention
- **Medium**: Boundary values + Type validations + Dropdown validations
- **Low**: Extreme boundaries + Optional fields + Rare edge cases

---

**Document Version**: 1.0  
**Created Date**: October 29, 2025  
**Author**: QA Team - Software Testing Course  
**Status**: ✅ Ready for Review
