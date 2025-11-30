
// Page Object for Products Page
class ProductsPage {
  visit() {
    cy.visit('/products');
  }

  getProductList() {
    return cy.get('[data-testid="product-list"]');
  }

  getProductByName(name) {
    return cy.contains('[data-testid="product-item"]', name);
  }

  addToCartByName(name) {
    this.getProductByName(name).find('button[data-testid="add-to-cart"]').click();
  }

  getCartButton() {
    return cy.get('[data-testid="cart-button"]');
  }

  getProductPriceByName(name) {
    return this.getProductByName(name).find('[data-testid="product-price"]');
  }

  getProductDescriptionByName(name) {
    return this.getProductByName(name).find('[data-testid="product-description"]');
  }
}

export default ProductsPage;
