class LoginPage {
  visit() {
    cy.visit('/login');
  }

  fillUsername(username) {
    cy.get('input[name="username"]').clear().type(username);
  }

  fillPassword(password) {
    cy.get('input[name="password"]').clear().type(password);
  }

  submit() {
    cy.get('button[type="submit"]').click();
  }

  getUsernameError() {
    return cy.contains(/username/i).parent().find('p.text-red-600');
  }

  getPasswordError() {
    return cy.contains(/password/i).parent().find('p.text-red-600');
  }

  getSubmitError() {
    return cy.get('.bg-red-50');
  }
}

export default LoginPage;
