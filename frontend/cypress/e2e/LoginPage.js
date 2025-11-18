import ProductsPage from './ProductsPage';

class LoginPage {
  visit() {
    cy.visit('/login');
  }

  fillEmail(email) {
    cy.get('input[name="email"]').type(email);
  }

  fillPassword(password) {
    cy.get('input[name="password"]').type(password);
  }

  submit() {
    cy.get('button[type="submit"]').click();
  }

  getErrorMessage() {
    return cy.get('[data-testid="login-error"]');
  }
}

export default LoginPage;
