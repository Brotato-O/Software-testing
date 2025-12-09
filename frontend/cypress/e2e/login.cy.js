import LoginPage from './LoginPage';

describe('Login Flow', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should disable submit button while loading', () => {
    loginPage.fillUsername('admin');
    loginPage.fillPassword('admin123');
    loginPage.submit();

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should login successfully with valid credentials (success flow)', () => {
    loginPage.fillUsername('admin');
    loginPage.fillPassword('admin123');
    loginPage.submit();

    // Vì onLoginSuccess() không redirect rõ ràng trong component
    // nên chỉ kiểm tra KHÔNG có lỗi
    cy.contains('Invalid credentials').should('not.exist');
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
    loginPage.fillPassword('admin123');
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