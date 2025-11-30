class CartPage {
  visit() {
    cy.visit('/cart');
  }

  getCartItems() {
    return cy.get('[data-testid="cart-item"]');
  }

  getCartItemByName(name) {
    return cy.contains('[data-testid="cart-item"]', name);
  }

  getCartCount() {
    return cy.get('[data-testid="cart-count"]');
  }

  getTotalPrice() {
    return cy.get('[data-testid="cart-total"]');
  }

  removeItemByName(name) {
    this.getCartItemByName(name).find('button[data-testid="remove-from-cart"]').click();
  }

  checkout() {
    cy.get('[data-testid="checkout-button"]').click();
  }
}

export default CartPage;
