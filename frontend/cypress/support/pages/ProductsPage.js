class ProductsPage {
  visit() {
    cy.visit('/products');
  }

  getProductList() {
    return cy.get('[data-testid="product-list"]');
  }

  getProductItems() {
    return cy.get('[data-testid="product-item"]');
  }

  getProductByName(name) {
    return cy.contains('[data-testid="product-item"]', name);
  }

  openProductByName(name) {
    this.getProductByName(name).find('a').click();
  }

  addToCartByName(name) {
    this.getProductByName(name).find('button[data-testid="add-to-cart"]').click();
  }

  searchFor(term) {
    cy.get('[data-testid="product-search"]').clear().type(term);
  }

  filterByCategory(category) {
    cy.get('[data-testid="product-filter"]').select(category);
  }
}

export default ProductsPage;
