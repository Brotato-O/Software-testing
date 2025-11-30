// Page objects available under cypress/support/pages

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

  loginAs(email, password) {
    this.visit();
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
    // Ensure the login process completes
    cy.url().should('not.include', '/login');
  }

  getErrorMessage() {
    return cy.get('[data-testid="login-error"]');
  }
}

export default LoginPage;
