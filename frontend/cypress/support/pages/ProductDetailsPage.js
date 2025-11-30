class ProductDetailsPage {
  getTitle() {
    return cy.get('[data-testid="product-title"]');
  }

  getPrice() {
    return cy.get('[data-testid="product-price"]');
  }

  getDescription() {
    return cy.get('[data-testid="product-description"]');
  }

  addToCart() {
    cy.get('[data-testid="add-to-cart"]').click();
  }
}

export default ProductDetailsPage;
