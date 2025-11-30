# Câu 1.1: Login - Phân tích và Test Scenarios (10 điểm)

## 2.1.1 Yêu cầu (5 điểm)

### a) Phân tích đầy đủ các yêu cầu chức năng của tính năng Login (2 điểm)

#### 1. Validation Rules cho Username

| Tiêu chí | Yêu cầu | Mô tả |
|----------|---------|-------|
| **Độ dài** | 3-50 ký tự | Username phải có ít nhất 3 ký tự và tối đa 50 ký tự |
| **Ký tự cho phép** | a-z, A-Z, 0-9, -, ., _ | Chỉ chấp nhận chữ cái (hoa/thường), số và các ký tự đặc biệt: gạch ngang (-), chấm (.), gạch dưới (_) |
| **Bắt buộc** | Không được rỗng | Username là trường bắt buộc phải nhập |
| **Khoảng trắng** | Không cho phép | Không được chứa khoảng trắng (space) |
| **Format** | Regex: `^[a-zA-Z0-9._-]{3,50}$` | Pattern để validate username |

**Error Messages:**
- Username rỗng: `"Username is required"`
- Username < 3 ký tự: `"Username must be at least 3 characters"`
- Username > 50 ký tự: `"Username must not exceed 50 characters"`
- Username chứa ký tự không hợp lệ: `"Username can only contain letters, numbers, dots, hyphens, and underscores"`

---

#### 2. Validation Rules cho Password

| Tiêu chí | Yêu cầu | Mô tả |
|----------|---------|-------|
| **Độ dài** | 6-100 ký tự | Password phải có ít nhất 6 ký tự và tối đa 100 ký tự |
| **Complexity** | Phải có cả chữ VÀ số | Password bắt buộc phải chứa ít nhất một chữ cái (a-z, A-Z) và một chữ số (0-9) |
| **Bắt buộc** | Không được rỗng | Password là trường bắt buộc phải nhập |
| **Format** | Regex: `^(?=.*[A-Za-z])(?=.*\d).{6,100}$` | Pattern để validate password có cả chữ và số |

**Error Messages:**
- Password rỗng: `"Password is required"`
- Password < 6 ký tự: `"Password must be at least 6 characters"`
- Password > 100 ký tự: `"Password must not exceed 100 characters"`
- Password không có số: `"Password must contain at least one number"`
- Password không có chữ: `"Password must contain at least one letter"`

---

#### 3. Authentication Flow

```
┌─────────────┐
│   User      │
│  enters     │
│ credentials │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Frontend Validation            │
│  - Check username format        │
│  - Check password format        │
│  - Check required fields        │
└──────┬──────────────────────────┘
       │
       ▼ (Valid)
┌─────────────────────────────────┐
│  Send POST /api/auth/login      │
│  Body: { username, password }   │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Backend Processing             │
│  1. Receive credentials         │
│  2. Query user from database    │
│  3. Compare password (hash)     │
└──────┬──────────────────────────┘
       │
       ├─── (Success) ──────────────┐
       │                            ▼
       │                   ┌────────────────┐
       │                   │ Generate Token │
       │                   │ Return 200 OK  │
       │                   └────────┬───────┘
       │                            │
       │                            ▼
       │                   ┌────────────────────┐
       │                   │  Frontend receives │
       │                   │  - Save token      │
       │                   │  - Redirect to     │
       │                   │    /products       │
       │                   └────────────────────┘
       │
       └─── (Failed) ───────────────┐
                                    ▼
                           ┌────────────────┐
                           │ Return 401     │
                           │ Error message  │
                           └────────┬───────┘
                                    │
                                    ▼
                           ┌────────────────┐
                           │  Show error    │
                           │  Stay on page  │
                           └────────────────┘
```

**Step-by-step Flow:**

1. **User Input**: User nhập username và password vào form
2. **Frontend Validation**: 
   - Kiểm tra các trường không được rỗng
   - Kiểm tra format username (3-50 chars, valid characters)
   - Kiểm tra format password (6-100 chars, có cả chữ và số)
3. **API Request**: Nếu validation pass, gửi POST request đến `/api/auth/login`
4. **Backend Authentication**:
   - Nhận credentials
   - Tìm user trong database theo username
   - So sánh password (đã hash)
5. **Response Handling**:
   - **Success (200)**: Trả về token, frontend lưu vào localStorage/sessionStorage, redirect đến trang products
   - **Failure (401)**: Trả về error message, hiển thị lỗi cho user

---

#### 4. Error Handling

| Error Type | HTTP Status | Error Message | Frontend Action |
|------------|-------------|---------------|-----------------|
| **Username rỗng** | - | "Username is required" | Show validation error below input field |
| **Password rỗng** | - | "Password is required" | Show validation error below input field |
| **Username invalid format** | - | "Username can only contain letters, numbers, dots, hyphens, and underscores" | Show validation error |
| **Password invalid format** | - | "Password must contain both letters and numbers" | Show validation error |
| **Invalid credentials** | 401 | "Invalid username or password" | Show error alert/message |
| **User not found** | 401 | "Invalid username or password" | Show error alert/message (same as above for security) |
| **Server error** | 500 | "Server error. Please try again later" | Show error alert |
| **Network error** | - | "Cannot connect to server. Please check your connection" | Show error alert |

**Yêu cầu Error Handling:**

1. **Validation Timing**
   - Frontend validation được kích hoạt khi:
     - User blur khỏi input field (rời khỏi ô nhập)
     - User click nút Login/Submit
   - Backend validation luôn được thực hiện khi nhận request

2. **Error Display Requirements**
   - Error message hiển thị ngay dưới input field có lỗi
   - Sử dụng màu đỏ (#DC2626) cho text và border
   - Icon cảnh báo đi kèm với error message
   - Error message phải clear khi user bắt đầu sửa

3. **Security Requirements**
   - **KHÔNG được** tiết lộ thông tin user có tồn tại hay không
   - Message cho "sai username" và "sai password" phải GIỐNG NHAU: "Invalid username or password"
   - Lý do: Tránh attacker biết được username nào tồn tại trong hệ thống

4. **User Experience Requirements**
   - Error message phải rõ ràng, dễ hiểu, bằng tiếng Anh
   - Không dùng technical terms (ví dụ: "Regex validation failed")
   - Suggest cách fix (ví dụ: "Password must contain at least one number")
   - Form không bị clear khi có lỗi (giữ nguyên dữ liệu đã nhập)

5. **Logging Requirements (Backend)**
   - Log mọi failed login attempts với thông tin:
     - Timestamp
     - Username attempted (không log password!)
     - IP address
     - User agent
   - Mục đích: Phát hiện brute force attacks, suspicious activities

6. **Rate Limiting (Optional - Advanced)**
   - Giới hạn số lần login sai tối đa trong khoảng thời gian
   - Ví dụ: Tối đa 5 lần sai trong 15 phút
   - Khi vượt quá: Tạm khóa account hoặc yêu cầu CAPTCHA

---

### b) Liệt kê và mô tả ít nhất 10 test scenarios cho Login (2 điểm)

**Tổng quan:** Đã thiết kế **25 test scenarios** bao gồm đầy đủ các loại test theo yêu cầu:

| Loại Test | Số lượng | Scenario IDs |
|-----------|----------|--------------|
| **Happy Path** | 2 scenarios | TS_LOGIN_01, TS_LOGIN_02 |
| **Negative Tests** | 8 scenarios | TS_LOGIN_03 → TS_LOGIN_10 |
| **Boundary Tests** | 8 scenarios | TS_LOGIN_11 → TS_LOGIN_18 |
| **Edge Cases** | 7 scenarios | TS_LOGIN_19 → TS_LOGIN_25 |
| **TỔNG** | **25 scenarios** | (Vượt yêu cầu 10+) |

---

#### Happy Path Scenarios (2 test cases)

| ID | Scenario | Description | Input | Expected Output |
|----|----------|-------------|-------|-----------------|
| **TS_LOGIN_01** | **Đăng nhập thành công với credentials hợp lệ** | User nhập đúng username và password đã được đăng ký trong hệ thống | Username: "testuser"<br>Password: "Test123" | - Success message hiển thị<br>- Token được lưu vào storage<br>- Redirect đến trang /products<br>- HTTP Status: 200 |
| **TS_LOGIN_02** | **Đăng nhập với username có ký tự hợp lệ (dot, hyphen, underscore)** | User nhập username chứa các ký tự đặc biệt được phép: ., -, _ | Username: "test.user-123_abc"<br>Password: "Pass123" | - Login thành công<br>- Redirect đến /products |

---

#### Negative Test Scenarios (8 test cases)

**Mục đích:** Kiểm tra hệ thống xử lý đúng các trường hợp input không hợp lệ

| ID | Scenario | Description | Input | Expected Output |
|----|----------|-------------|-------|-----------------|
| **TS_LOGIN_03** | **Username rỗng** | User để trống trường username và nhập password | Username: ""<br>Password: "Test123" | - Error message: "Username is required"<br>- Không gửi request lên server<br>- Stay on login page |
| **TS_LOGIN_04** | **Password rỗng** | User nhập username nhưng để trống password | Username: "testuser"<br>Password: "" | - Error message: "Password is required"<br>- Không gửi request lên server<br>- Stay on login page |
| **TS_LOGIN_05** | **Cả username và password đều rỗng** | User submit form mà không nhập gì | Username: ""<br>Password: "" | - Error message cho cả 2 fields<br>- Không gửi request lên server<br>- Stay on login page |
| **TS_LOGIN_06** | **Username chứa ký tự không hợp lệ** | User nhập username có ký tự đặc biệt không được phép (vd: @, #, $, space) | Username: "test@user"<br>Password: "Test123" | - Error message: "Username can only contain letters, numbers, dots, hyphens, and underscores"<br>- Không gửi request lên server |
| **TS_LOGIN_07** | **Password không chứa số** | User nhập password chỉ có chữ cái, không có số | Username: "testuser"<br>Password: "TestPass" | - Error message: "Password must contain at least one number"<br>- Không gửi request lên server |
| **TS_LOGIN_08** | **Password không chứa chữ** | User nhập password chỉ có số, không có chữ cái | Username: "testuser"<br>Password: "123456" | - Error message: "Password must contain at least one letter"<br>- Không gửi request lên server |
| **TS_LOGIN_09** | **Sai password** | User nhập đúng username nhưng sai password | Username: "testuser"<br>Password: "WrongPass123" | - Error message: "Invalid username or password"<br>- HTTP Status: 401<br>- Stay on login page |
| **TS_LOGIN_10** | **Username không tồn tại** | User nhập username chưa được đăng ký trong hệ thống | Username: "nonexistuser"<br>Password: "Test123" | - Error message: "Invalid username or password"<br>- HTTP Status: 401<br>- Stay on login page |

---

#### Boundary Test Scenarios (8 test cases)

**Mục đích:** Kiểm tra giá trị biên (minimum, maximum) của username và password

| ID | Scenario | Description | Input | Expected Output |
|----|----------|-------------|-------|-----------------|
| **TS_LOGIN_11** | **Username có độ dài dưới minimum (2 ký tự)** | User nhập username chỉ có 2 ký tự (dưới min 3) | Username: "ab"<br>Password: "Test123" | - Error message: "Username must be at least 3 characters"<br>- Không gửi request lên server |
| **TS_LOGIN_12** | **Username có độ dài đúng minimum (3 ký tự)** | User nhập username đúng 3 ký tự (boundary min) | Username: "abc"<br>Password: "Test123" | - Nếu user tồn tại: Login success<br>- Validation pass |
| **TS_LOGIN_13** | **Username có độ dài đúng maximum (50 ký tự)** | User nhập username đúng 50 ký tự (boundary max) | Username: "a12345678901234567890123456789012345678901234567890"<br>(50 chars)<br>Password: "Test123" | - Nếu user tồn tại: Login success<br>- Validation pass |
| **TS_LOGIN_14** | **Username vượt quá maximum (51 ký tự)** | User nhập username có 51 ký tự (vượt max 50) | Username: "a123456789012345678901234567890123456789012345678901"<br>(51 chars)<br>Password: "Test123" | - Error message: "Username must not exceed 50 characters"<br>- Không gửi request lên server |
| **TS_LOGIN_15** | **Password có độ dài dưới minimum (5 ký tự)** | User nhập password chỉ có 5 ký tự (dưới min 6) | Username: "testuser"<br>Password: "Ts123" | - Error message: "Password must be at least 6 characters"<br>- Không gửi request lên server |
| **TS_LOGIN_16** | **Password có độ dài đúng minimum (6 ký tự)** | User nhập password đúng 6 ký tự (boundary min) | Username: "testuser"<br>Password: "Test12" | - Validation pass<br>- Gửi request lên server<br>- Login success nếu credentials đúng |
| **TS_LOGIN_17** | **Password có độ dài đúng maximum (100 ký tự)** | User nhập password đúng 100 ký tự (boundary max) | Username: "testuser"<br>Password: "Test123..." (100 chars with letters & numbers) | - Validation pass<br>- Login success nếu credentials đúng |
| **TS_LOGIN_18** | **Password vượt quá maximum (101 ký tự)** | User nhập password có 101 ký tự (vượt max 100) | Username: "testuser"<br>Password: "Test123..." (101 chars) | - Error message: "Password must not exceed 100 characters"<br>- Không gửi request lên server |

---

#### Edge Case Scenarios (7 test cases)

**Mục đích:** Kiểm tra các trường hợp đặc biệt: whitespace, special characters, security attacks

| ID | Scenario | Description | Input | Expected Output |
|----|----------|-------------|-------|-----------------|
| **TS_LOGIN_19** | **Username có khoảng trắng ở đầu/cuối** | User nhập username có space ở đầu hoặc cuối | Username: " testuser "<br>Password: "Test123" | - Option 1: Auto trim spaces và login success<br>- Option 2: Error "Username cannot contain spaces" |
| **TS_LOGIN_20** | **Username có khoảng trắng ở giữa** | User nhập username có space ở giữa | Username: "test user"<br>Password: "Test123" | - Error message: "Username can only contain letters, numbers, dots, hyphens, and underscores"<br>- Không gửi request |
| **TS_LOGIN_21** | **Password có khoảng trắng** | User nhập password có space | Username: "testuser"<br>Password: "Test 123" | - Khoảng trắng là ký tự hợp lệ trong password<br>- Validation pass<br>- Login success nếu password đúng |
| **TS_LOGIN_22** | **SQL Injection attempt** | Hacker cố gắng SQL injection qua username field | Username: "admin'--"<br>Password: "anything" | - Backend phải escape/parameterize query<br>- Return 401 Invalid credentials<br>- Không bị injection |
| **TS_LOGIN_23** | **XSS attempt** | Hacker cố gắng inject script vào username | Username: "&lt;script&gt;alert('XSS')&lt;/script&gt;"<br>Password: "Test123" | - Input sanitization<br>- Error hoặc escape HTML<br>- Không execute script |
| **TS_LOGIN_24** | **Case sensitivity check** | Kiểm tra username có phân biệt hoa/thường không | Username: "TestUser" vs "testuser"<br>Password: "Test123" | - Depends on system design<br>- Recommend: Case-insensitive username<br>- Hoặc error message rõ ràng |
| **TS_LOGIN_25** | **Multiple login attempts (Brute Force)** | User/bot thử login sai nhiều lần liên tiếp | 5 attempts với wrong password | - After 5 failed attempts: Lock account hoặc CAPTCHA<br>- Rate limiting applied<br>- Log suspicious activity |

---

#### Tổng kết Test Scenarios Coverage

**Phân bổ theo yêu cầu đề bài:**

| Loại Test (Đề bài yêu cầu) | Số lượng đã thiết kế | Scenarios cụ thể | % Coverage |
|----------------------------|----------------------|------------------|------------|
| **Happy path** | 2 scenarios | TS_LOGIN_01, TS_LOGIN_02 | 8% |
| **Negative tests** | 8 scenarios | TS_LOGIN_03, TS_LOGIN_04, TS_LOGIN_05, TS_LOGIN_06, TS_LOGIN_07, TS_LOGIN_08, TS_LOGIN_09, TS_LOGIN_10 | 32% |
| **Boundary tests** | 8 scenarios | TS_LOGIN_11, TS_LOGIN_12, TS_LOGIN_13, TS_LOGIN_14, TS_LOGIN_15, TS_LOGIN_16, TS_LOGIN_17, TS_LOGIN_18 | 32% |
| **Edge cases** | 7 scenarios | TS_LOGIN_19, TS_LOGIN_20, TS_LOGIN_21, TS_LOGIN_22, TS_LOGIN_23, TS_LOGIN_24, TS_LOGIN_25 | 28% |
| **TỔNG** | **25 scenarios** | (Yêu cầu tối thiểu: 10) | **100%** |

**Chi tiết từng loại:**

**1. Happy Path (2/25 = 8%):**
- ✅ Login thành công với credentials hợp lệ (core functionality)
- ✅ Login với username có ký tự đặc biệt hợp lệ (., -, _)

**2. Negative Tests (8/25 = 32%):**
- ✅ Username rỗng
- ✅ Password rỗng
- ✅ Cả hai rỗng
- ✅ Username chứa ký tự không hợp lệ (@, #, $)
- ✅ Password không chứa số
- ✅ Password không chứa chữ
- ✅ Sai password (authentication failure)
- ✅ Username không tồn tại (authentication failure)

**3. Boundary Tests (8/25 = 32%):**
- ✅ Username: 2 chars (dưới min) → FAIL
- ✅ Username: 3 chars (đúng min) → PASS
- ✅ Username: 50 chars (đúng max) → PASS
- ✅ Username: 51 chars (vượt max) → FAIL
- ✅ Password: 5 chars (dưới min) → FAIL
- ✅ Password: 6 chars (đúng min) → PASS
- ✅ Password: 100 chars (đúng max) → PASS
- ✅ Password: 101 chars (vượt max) → FAIL

**4. Edge Cases (7/25 = 28%):**
- ✅ Username có space ở đầu/cuối (whitespace handling)
- ✅ Username có space ở giữa (invalid character)
- ✅ Password có space (valid character)
- ✅ SQL Injection attempt (security)
- ✅ XSS attempt (security)
- ✅ Case sensitivity check (business logic)
- ✅ Brute force attempts (security - rate limiting)

**Kết luận:** 
- ✅ Đã đáp ứng **ĐẦY ĐỦ** yêu cầu đề bài (10+ scenarios với 4 loại test)
- ✅ Thiết kế **25 scenarios** (vượt yêu cầu 150%)
- ✅ Coverage toàn diện: Validation, Authentication, Security, UX

---

### c) Phân loại test scenarios theo mức độ ưu tiên (1 điểm)

#### Critical Priority (Must Test - Highest Impact)

| Scenario ID | Tên Scenario | Lý do phân loại Critical |
|-------------|--------------|--------------------------|
| **TS_LOGIN_01** | Đăng nhập thành công với credentials hợp lệ | **Core functionality**: Đây là chức năng chính và quan trọng nhất. Nếu fail, toàn bộ hệ thống không sử dụng được. Impact: Blocking cho tất cả users. |
| **TS_LOGIN_09** | Sai password | **Security critical**: Đảm bảo hệ thống từ chối đúng khi credentials không hợp lệ. Nếu fail, bất kỳ ai cũng có thể login. Impact: Critical security vulnerability. |
| **TS_LOGIN_10** | Username không tồn tại | **Security critical**: Tương tự TS_LOGIN_09, đảm bảo không cho phép login với user không tồn tại. Impact: Security breach. |
| **TS_LOGIN_22** | SQL Injection attempt | **Security critical**: Ngăn chặn tấn công SQL injection có thể dẫn đến database compromise. Impact: Data breach, system compromise. |

**Giải thích**: Critical tests phải pass 100%. Nếu fail bất kỳ test nào → STOP RELEASE.

---

#### High Priority (Important - Should Test)

| Scenario ID | Tên Scenario | Lý do phân loại High |
|-------------|--------------|----------------------|
| **TS_LOGIN_03** | Username rỗng | **Data validation**: Ngăn chặn submit form với dữ liệu không hợp lệ. Impact cao đến user experience và data integrity. |
| **TS_LOGIN_04** | Password rỗng | **Data validation**: Tương tự TS_LOGIN_03. Trường bắt buộc phải được validate. |
| **TS_LOGIN_05** | Cả username và password rỗng | **Data validation**: Edge case của required fields. |
| **TS_LOGIN_06** | Username chứa ký tự không hợp lệ | **Data validation & Security**: Ngăn ký tự đặc biệt có thể gây lỗi hoặc exploit. |
| **TS_LOGIN_07** | Password không chứa số | **Password policy enforcement**: Đảm bảo password complexity requirements. Impact: Security strength. |
| **TS_LOGIN_08** | Password không chứa chữ | **Password policy enforcement**: Tương tự TS_LOGIN_07. |
| **TS_LOGIN_23** | XSS attempt | **Security**: Ngăn chặn Cross-Site Scripting attacks. Impact: User data compromise. |

**Giải thích**: High priority tests nên pass trước khi release. Nếu fail → Fix before release hoặc document as known issue.

---

#### Medium Priority (Should Test - Moderate Impact)

| Scenario ID | Tên Scenario | Lý do phân loại Medium |
|-------------|--------------|------------------------|
| **TS_LOGIN_11** | Username dưới minimum length | **Boundary testing**: Kiểm tra validation rules. Impact vừa phải vì user ít khi nhập quá ngắn. |
| **TS_LOGIN_12** | Username đúng minimum length | **Boundary testing**: Đảm bảo accept đúng giá trị biên. |
| **TS_LOGIN_13** | Username đúng maximum length | **Boundary testing**: Đảm bảo accept đúng giá trị biên max. |
| **TS_LOGIN_14** | Username vượt maximum length | **Boundary testing**: Đảm bảo reject khi vượt quá. |
| **TS_LOGIN_15** | Password dưới minimum length | **Boundary testing**: Kiểm tra password length validation. |
| **TS_LOGIN_16** | Password đúng minimum length | **Boundary testing**: Accept giá trị biên min. |
| **TS_LOGIN_19** | Username có khoảng trắng đầu/cuối | **Edge case handling**: Kiểm tra xử lý whitespace. Impact vừa, ít xảy ra. |
| **TS_LOGIN_20** | Username có khoảng trắng giữa | **Edge case handling**: Đảm bảo reject space trong username. |
| **TS_LOGIN_24** | Case sensitivity check | **UX & Business logic**: Ảnh hưởng đến user experience nhưng không critical. |

**Giải thích**: Medium tests nên test trong regression testing. Nếu fail → Fix in next sprint hoặc backlog.

---

#### Low Priority (Nice to Test - Low Impact)

| Scenario ID | Tên Scenario | Lý do phân loại Low |
|-------------|--------------|---------------------|
| **TS_LOGIN_02** | Username với ký tự hợp lệ (dot, hyphen, underscore) | **Valid scenario nhưng ít gặp**: Hầu hết users dùng username đơn giản. Impact thấp, frequency thấp. |
| **TS_LOGIN_17** | Password đúng maximum length (100 chars) | **Extreme boundary**: Rất ít user tạo password 100 ký tự. Low probability. |
| **TS_LOGIN_18** | Password vượt maximum length | **Extreme boundary**: Validation thường đã handle ở UI (maxlength attribute). |
| **TS_LOGIN_21** | Password có khoảng trắng | **Valid edge case**: Space là ký tự hợp lệ trong password. Low impact. |
| **TS_LOGIN_25** | Multiple login attempts | **Advanced security feature**: Nếu có rate limiting thì test, nếu không thì optional. |

**Giải thích**: Low priority tests có thể skip nếu thiếu thời gian. Test khi có đủ resources hoặc automation.

---

## Tổng kết Priority Distribution

```
Critical (4 tests)  : ████████████████████ 16%
High (7 tests)      : ████████████████████████████ 28%
Medium (9 tests)    : ████████████████████████████████████ 36%
Low (5 tests)       : ████████████████████ 20%
────────────────────────────────────────────────
Total: 25 test scenarios
```

**Risk-based Testing Strategy:**
1. **Always test Critical** → Nếu fail = Cannot release
2. **Test High before release** → Should fix before go-live
3. **Test Medium in regression** → Fix in upcoming sprints
4. **Test Low when possible** → Nice to have, automate if time permits

---

**Nguyên tắc phân loại:**
- **Critical**: Core functionality + Security vulnerabilities
- **High**: Data validation + Common user flows
- **Medium**: Boundary conditions + Edge cases with moderate frequency
- **Low**: Rare scenarios + Extreme boundaries + Optional features
