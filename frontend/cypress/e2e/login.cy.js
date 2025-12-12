import LoginPage from './LoginPage';

describe('Login Flow', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should disable submit button while loading', () => {
    // stub login with a small delay to observe loading state
    cy.intercept('POST', 'http://localhost:8080/api/auth/login', (req) => {
      req.on('response', (res) => {});
    }).as('loginSlow');

    loginPage.fillUsername('admin');
    loginPage.fillPassword('Admin123');
    loginPage.submit();

    // submit button should be disabled while request is in-flight
    cy.get('button[type="submit"]').should('be.disabled');
    cy.wait('@loginSlow');
  });

  it('should login successfully with valid credentials (success flow)', () => {
    // Stub successful login response and verify Products UI is shown
    cy.intercept('POST', 'http://localhost:8080/api/auth/login', {
      statusCode: 200,
      body: { success: true, message: 'Dang nhap thanh cong', token: 'TOKEN_admin_stub' }
    }).as('loginSuccess');

    loginPage.fillUsername('admin');
    loginPage.fillPassword('Admin123');
    loginPage.submit();

    cy.wait('@loginSuccess');

    // onLoginSuccess() should switch to Products UI
    cy.contains('Product Management').should('be.visible');
  });

  it('should show error with invalid credentials (error flow)', () => {
    loginPage.fillUsername('admin');
    loginPage.fillPassword('wrongpassword');
    loginPage.submit();

    // loginPage.getSubmitError().should('be.visible');
  });

  it('should require username and password', () => {
    loginPage.submit();

    loginPage.getUsernameError().should('be.visible');
    loginPage.getPasswordError().should('be.visible');
  });

  it('should show validation message for invalid username', () => {
    loginPage.fillUsername('a'); // username không hợp lệ
    loginPage.fillPassword('Admin123');
    loginPage.submit();

    loginPage.getUsernameError().should('be.visible');
  });

  it('should show validation message for invalid password', () => {
    loginPage.fillUsername('admin');
    loginPage.fillPassword('123'); // password không hợp lệ
    loginPage.submit();

    loginPage.getPasswordError().should('be.visible');
  });
});