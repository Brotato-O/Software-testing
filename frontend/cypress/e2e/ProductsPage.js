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
}

export default ProductsPage;
