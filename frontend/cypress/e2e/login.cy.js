import LoginPage from './LoginPage';
import { ProductsPage } from '../support/pages';

describe('Login Flow', () => {
  const loginPage = new LoginPage();
  const productsPage = new ProductsPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should enable submit button only when form is valid', () => {
    // Ban đầu nút submit phải bị disable
    cy.get('button[type="submit"]').should('be.disabled');
    // Nhập email hợp lệ
    loginPage.fillEmail('user@example.com');
    cy.get('button[type="submit"]').should('be.disabled');
    // Nhập password hợp lệ
    loginPage.fillPassword('password123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should toggle password visibility', () => {
    // Giả sử có nút hiển thị/ẩn password với data-testid="toggle-password"
    loginPage.fillPassword('password123');
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    cy.get('[data-testid="toggle-password"]').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    cy.get('[data-testid="toggle-password"]').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('should navigate to register page when clicking register link', () => {
    // Giả sử có link đăng ký với data-testid="register-link"
    cy.get('[data-testid="register-link"]').click();
    cy.url().should('include', '/register');
  });

  it('should login successfully with valid credentials (success flow)', () => {
    loginPage.fillEmail('user@example.com');
    loginPage.fillPassword('password123');
    loginPage.submit();
    // Kiểm tra chuyển hướng sang trang sản phẩm
    cy.url().should('include', '/products');
    productsPage.getProductList().should('exist');
    // Có thể kiểm tra thêm thông báo thành công nếu có
    // cy.get('[data-testid="login-success"]').should('be.visible');
  });

  it('should show error with invalid credentials (error flow)', () => {
    loginPage.fillEmail('user@example.com');
    loginPage.fillPassword('wrongpassword');
    loginPage.submit();
    loginPage.getErrorMessage().should('be.visible');
    // Có thể kiểm tra nội dung thông báo lỗi cụ thể
    // loginPage.getErrorMessage().should('contain', 'Invalid credentials');
  });

  it('should require email and password', () => {
    loginPage.submit();
    loginPage.getErrorMessage().should('be.visible');
  });

  it('should show validation message for invalid email format', () => {
    loginPage.fillEmail('invalid-email');
    loginPage.fillPassword('password123');
    loginPage.submit();
    cy.get('[data-testid="email-error"]').should('be.visible');
  });

  it('should show validation message for empty password', () => {
    loginPage.fillEmail('user@example.com');
    loginPage.submit();
    cy.get('[data-testid="password-error"]').should('be.visible');
  });
});
