# Product Management System

Full-stack CRUD app: React + Tailwind + Spring Boot + MySQL

## Tech Stack

**Frontend:** React 18, Tailwind CSS, Axios  
**Backend:** Spring Boot 3.2, MySQL, JPA/Hibernate  
**Java:** 17+

## Quick Start

### 1. Database Setup
```sql
CREATE DATABASE test;
CREATE USER 'hbstudent'@'localhost' IDENTIFIED BY 'hbstudent';
GRANT ALL PRIVILEGES ON test.* TO 'hbstudent'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
API runs on `http://localhost:8080`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:3000`

## Project Structure

```
├── backend/
│   ├── src/main/java/com/flogin/
│   │   ├── controller/          # REST API endpoints
│   │   ├── service/             # Business logic
│   │   ├── entity/              # JPA entities
│   │   ├── repository/          # Database access
│   │   └── dto/                 # Data transfer objects
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components (Login, Products)
│   │   ├── services/api.jsx     # Axios API calls
│   │   └── utils/               # Validation helpers
│   └── package.json
```

## API Endpoints

```
POST   /api/auth/login           # Login
GET    /api/products             # Get all products
GET    /api/products/{id}        # Get product by ID
POST   /api/products             # Create product
PUT    /api/products/{id}        # Update product
DELETE /api/products/{id}        # Delete product
```

## Database Config

File: `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=hbstudent
spring.datasource.password=hbstudent
spring.jpa.hibernate.ddl-auto=update
```

## Features

✅ User authentication  
✅ Product CRUD operations  
✅ Responsive UI with Tailwind CSS  
✅ Form validation  
✅ Error handling  
✅ MySQL persistence  

## Default Credentials

Username: `admin`  
Password: `admin123`

## Notes

- Frontend uses Axios for API calls
- Backend auto-creates tables on first run
- Tailwind CSS for styling
- All components use `.jsx` extension

---

**Dev:** Run both frontend & backend simultaneously for full-stack development.
   ./mvnw clean install
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will start on http://localhost:8080

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will start on http://localhost:3000

## Features

### Authentication
- Login form with validation
- Protected routes
- Error handling

### Product Management
- Create, Read, Update, Delete (CRUD) operations
- Form validation
- Responsive design
- Interactive UI with animations

## Testing

### Backend Tests
Run the tests using:
```bash
cd backend
./mvnw test
```

### Frontend Tests
Run the tests using:
```bash
cd frontend
npm test
```

## Default Credentials
For testing purposes:
- Username: admin
- Password: password

## API Endpoints

### Authentication
- POST /api/auth/login - Login endpoint

### Products
- GET /api/products - Get all products
- GET /api/products/{id} - Get a specific product
- POST /api/products - Create a new product
- PUT /api/products/{id} - Update a product
- DELETE /api/products/{id} - Delete a product