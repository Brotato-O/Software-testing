export class ProductsPage {
  visit() {
    cy.visit('/products');
  }

  // ===== FORM =====
  getNameInput() {
    return cy.get('input[name="name"]');
  }

  getPriceInput() {
    return cy.get('input[name="price"]');
  }

  getDescriptionInput() {
    return cy.get('textarea[name="description"]');
  }

  getSubmitButton() {
    return cy.get('button[type="submit"]');
  }

  getCancelButton() {
    return cy.contains('Cancel');
  }

  // ===== LIST =====
  getProductList() {
    return cy.get('[data-testid="product-item"]');
  }

  getProductByName(name) {
    return cy.contains('[data-testid="product-name"]', name)
      .parents('[data-testid="product-item"]');
  }

  getEditButton(productName) {
    return this.getProductByName(productName)
      .find('[data-testid="edit-product-btn"]');
  }

  getDeleteButton(productName) {
    return this.getProductByName(productName)
      .find('[data-testid="delete-product-btn"]');
  }

  // ===== SEARCH =====
  searchFor(text) {
    cy.get('[data-testid="product-search"]').clear().type(text);
  }

  // ===== ACTIONS =====
  createProduct({ name, price, description }) {
    this.getNameInput().type(name);
    this.getPriceInput().type(price);
    if (description) {
      this.getDescriptionInput().type(description);
    }
    this.getSubmitButton().click();
  }

  updateProduct({ name, price }) {
    if (name) {
      this.getNameInput().clear().type(name);
    }
    if (price) {
      this.getPriceInput().clear().type(price);
    }
    this.getSubmitButton().click();
  }
}
