# Câu 1.1.2: Thiết kế Test Cases Chi tiết cho Login (5 điểm)

**Trường Đại học Sài Gòn**  
**Khoa Công Nghệ Thông Tin**

---

## Yêu cầu

Thiết kế **5 test cases quan trọng nhất** cho chức năng Login theo template chuẩn Software Testing.

---

## Test Case 1: Login Thành công với Credentials Hợp lệ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_LOGIN_001 |
| **Test Name** | Đăng nhập thành công với credentials hợp lệ |
| **Priority** | Critical |
| **Preconditions** | - User account "testuser" exists in database<br>- Password "Test123" is correct for this user<br>- Application is running<br>- User is on login page (http://localhost:3000/login) |
| **Test Steps** | 1. Navigate to login page<br>2. Enter valid username: "testuser"<br>3. Enter valid password: "Test123"<br>4. Click "Login" button<br>5. Observe the result |
| **Test Data** | **Username:** testuser<br>**Password:** Test123 |
| **Expected Result** | ✅ Success message displayed: "Login successful"<br>✅ Authentication token stored in localStorage<br>✅ Redirect to products page (/products)<br>✅ User can see product list<br>✅ HTTP Status: 200 OK |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: Đây là core functionality - chức năng chính nhất của hệ thống. Nếu test này fail, toàn bộ ứng dụng không thể sử dụng được.
- **Impact**: Blocking cho tất cả users.

---

## Test Case 2: Login Thất bại - Sai Password

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_LOGIN_002 |
| **Test Name** | Đăng nhập thất bại với password không đúng |
| **Priority** | Critical |
| **Preconditions** | - User account "testuser" exists in database<br>- Correct password is "Test123"<br>- Application is running<br>- User is on login page |
| **Test Steps** | 1. Navigate to login page<br>2. Enter valid username: "testuser"<br>3. Enter **wrong** password: "WrongPass123"<br>4. Click "Login" button<br>5. Observe the error message |
| **Test Data** | **Username:** testuser<br>**Password:** WrongPass123 *(incorrect)* |
| **Expected Result** | ❌ Error message displayed: "Invalid username or password"<br>❌ No token stored in localStorage<br>❌ Stay on login page (no redirect)<br>❌ Username and password fields remain filled<br>❌ HTTP Status: 401 Unauthorized |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: Security critical - đảm bảo hệ thống từ chối đúng khi credentials không hợp lệ. Nếu fail, bất kỳ ai cũng có thể login.
- **Impact**: Critical security vulnerability.

---

## Test Case 3: Validation - Username Rỗng

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_LOGIN_003 |
| **Test Name** | Validation error khi username để trống |
| **Priority** | High |
| **Preconditions** | - Application is running<br>- User is on login page |
| **Test Steps** | 1. Navigate to login page<br>2. Leave username field **empty**<br>3. Enter valid password: "Test123"<br>4. Click "Login" button<br>5. Observe validation error |
| **Test Data** | **Username:** *(empty string)*<br>**Password:** Test123 |
| **Expected Result** | ❌ Validation error message below username field: "Username is required"<br>❌ Red border around username input field<br>❌ No API request sent to backend<br>❌ Stay on login page<br>❌ Focus should move to username field |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: Data validation - ngăn chặn submit form với dữ liệu không hợp lệ. Impact cao đến user experience và data integrity.
- **Impact**: Prevents unnecessary API calls và database queries.

---

## Test Case 4: Validation - Password Không Chứa Số

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_LOGIN_004 |
| **Test Name** | Validation error khi password không chứa số |
| **Priority** | High |
| **Preconditions** | - Application is running<br>- User is on login page |
| **Test Steps** | 1. Navigate to login page<br>2. Enter valid username: "testuser"<br>3. Enter password **without numbers**: "TestPass"<br>4. Click "Login" button or blur from password field<br>5. Observe validation error |
| **Test Data** | **Username:** testuser<br>**Password:** TestPass *(no numbers)* |
| **Expected Result** | ❌ Validation error message: "Password must contain at least one number"<br>❌ Red border around password input field<br>❌ No API request sent to backend<br>❌ Stay on login page |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: Password policy enforcement - đảm bảo password complexity requirements.
- **Impact**: Security strength, enforces strong password policy.

---

## Test Case 5: Security - SQL Injection Attempt

| Field | Value |
|-------|-------|
| **Test Case ID** | TC_LOGIN_005 |
| **Test Name** | Ngăn chặn SQL Injection attack qua username field |
| **Priority** | Critical |
| **Preconditions** | - Application is running<br>- Backend has proper input sanitization<br>- User is on login page |
| **Test Steps** | 1. Navigate to login page<br>2. Enter malicious SQL injection string in username: "admin'--"<br>3. Enter any password: "anything"<br>4. Click "Login" button<br>5. Observe system behavior and database logs |
| **Test Data** | **Username:** admin'-- *(SQL injection attempt)*<br>**Password:** anything |
| **Expected Result** | ❌ Either validation error or 401 Unauthorized response<br>❌ No SQL query executed in database<br>❌ Database not compromised<br>❌ Error logged in security logs<br>❌ No user data exposed |
| **Actual Result** | *(Để trống - To be filled after execution)* |
| **Status** | Not Run |

**Notes:**  
- **Lý do quan trọng**: Security critical - ngăn chặn tấn công SQL injection có thể dẫn đến database compromise.
- **Impact**: Data breach, system compromise, unauthorized access.
- **Verify**: Check backend uses parameterized queries hoặc ORM (Hibernate).

---

## Test Execution Summary

| Priority | Test Cases | Count |
|----------|------------|-------|
| **Critical** | TC_LOGIN_001, TC_LOGIN_002, TC_LOGIN_005 | 3 |
| **High** | TC_LOGIN_003, TC_LOGIN_004 | 2 |
| **Total** | | **5** |

---

## Test Coverage Analysis

### Loại Test Coverage

| Loại Test | Test Cases | Coverage |
|-----------|------------|----------|
| **Happy Path** | TC_LOGIN_001 | ✅ Covered |
| **Negative Tests** | TC_LOGIN_002, TC_LOGIN_003, TC_LOGIN_004 | ✅ Covered |
| **Security Tests** | TC_LOGIN_005 | ✅ Covered |

### Validation Rules Coverage

| Validation Rule | Test Cases | Status |
|-----------------|------------|--------|
| Username required | TC_LOGIN_003 | ✅ Covered |
| Password complexity (có số) | TC_LOGIN_004 | ✅ Covered |
| Authentication logic | TC_LOGIN_001, TC_LOGIN_002 | ✅ Covered |
| SQL Injection prevention | TC_LOGIN_005 | ✅ Covered |

---

## Traceability Matrix

Mapping Test Cases to Requirements:

| Requirement | Test Cases | Status |
|-------------|------------|--------|
| **REQ-LOGIN-001**: User phải login được với valid credentials | TC_LOGIN_001 | ✅ |
| **REQ-LOGIN-002**: Hệ thống phải reject invalid credentials | TC_LOGIN_002 | ✅ |
| **REQ-LOGIN-003**: Username là trường bắt buộc | TC_LOGIN_003 | ✅ |
| **REQ-LOGIN-004**: Password phải có cả chữ và số | TC_LOGIN_004 | ✅ |
| **REQ-LOGIN-005**: Security - prevent SQL injection | TC_LOGIN_005 | ✅ |

---

## Prerequisites for Test Execution

### Environment Setup:
1. ✅ Backend server running on `http://localhost:8080`
2. ✅ Frontend application running on `http://localhost:3000`
3. ✅ MySQL database "test" is running with credentials: hbstudent/hbstudent
4. ✅ Test user account created in database

### Test Data Setup (SQL):
```sql
-- Create test user for TC_LOGIN_001, TC_LOGIN_002
INSERT INTO users (username, password) 
VALUES ('testuser', 'hashed_Test123');
-- Password "Test123" should be hashed using BCrypt
```

### Tools Required:
- Browser: Chrome/Edge (latest version)
- Browser DevTools (Network tab for HTTP status, Console for errors)
- Screenshot tool for test evidences
- Test management tool: Excel/Google Sheets hoặc TestRail

---

## Execution Order (by Priority)

**Critical Priority First (Must Pass):**
1. TC_LOGIN_001 → Core functionality
2. TC_LOGIN_002 → Security authentication
3. TC_LOGIN_005 → Security attack prevention

**High Priority:**
4. TC_LOGIN_003 → Required field validation
5. TC_LOGIN_004 → Password policy validation

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
| **Estimated Execution Time** | 15-20 minutes |
| **Pass Criteria** | >= 80% (4/5 tests) |
| **Critical Tests** | 3 (must be 100% pass) |
| **Coverage** | Happy Path, Negative, Security |

---

## Defect Severity Classification

| Severity | Description | Example |
|----------|-------------|---------|
| **Critical** | Login fails with valid credentials, Security breach | TC_LOGIN_001 fails, SQL injection successful |
| **High** | Validation not working, Wrong error messages | TC_LOGIN_003/004 fails |
| **Medium** | UI issues, Inconsistent behavior | Button position, color |
| **Low** | Cosmetic issues, Typos | Spelling errors |

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

1. **TC_LOGIN_001** (Critical): Core functionality - login thành công là chức năng cơ bản nhất
2. **TC_LOGIN_002** (Critical): Security - đảm bảo authentication hoạt động đúng
3. **TC_LOGIN_003** (High): Validation - required field là validation quan trọng nhất
4. **TC_LOGIN_004** (High): Password policy - enforce security requirements
5. **TC_LOGIN_005** (Critical): Security attack - SQL injection là mối đe dọa phổ biến nhất

**Coverage:**
- ✅ Happy Path: 1 case
- ✅ Negative Tests: 3 cases  
- ✅ Security Tests: 1 case
- ✅ Validation: 2 cases

**Priority Distribution:**
- Critical: 3 cases (60%)
- High: 2 cases (40%)
