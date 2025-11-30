class ProductPage {
  visit() {
    cy.visit('/products');
  }

  clickAddNew() {
    cy.get('[data-testid="add-product-btn"]').click();
  }

  fillProductForm(product) {
    if (product.name !== undefined) {
      cy.get('[data-testid="product-name"]').clear().type(product.name);
    }
    if (product.price !== undefined) {
      cy.get('[data-testid="product-price"]').clear().type(String(product.price));
    }
    if (product.quantity !== undefined) {
      cy.get('[data-testid="product-quantity"]').clear().type(String(product.quantity));
    }
    if (product.description !== undefined) {
      cy.get('[data-testid="product-description"]').clear().type(product.description);
    }
  }

  submitForm() {
    cy.get('[data-testid="submit-btn"]').click();
  }

  getSuccessMessage() {
    return cy.get('[data-testid="success-message"]');
  }

  getProductInList(name) {
    return cy.contains('[data-testid="product-item"]', name);
  }

  editProductByName(name) {
    this.getProductInList(name).find('[data-testid="edit-product-btn"]').click();
  }

  deleteProductByName(name) {
    this.getProductInList(name).find('[data-testid="delete-product-btn"]').click();
  }

  openProductByName(name) {
    this.getProductInList(name).find('a').click();
  }
}

export default ProductPage;
