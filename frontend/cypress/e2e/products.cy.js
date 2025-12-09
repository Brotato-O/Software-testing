import { ProductsPage } from '../support/pages/ProductsPage';

describe('Product E2E - Page Object Model', () => {
  const productsPage = new ProductsPage();

  beforeEach(() => {
    cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');
    productsPage.visit();
    cy.wait('@getProducts');
  });

  // a) CREATE PRODUCT
  it('should create a new product', () => {
    cy.intercept('POST', '/api/products', { statusCode: 201 }).as('createProduct');

    productsPage.createProduct({
      name: 'New Laptop',
      price: '1200',
      description: 'Gaming laptop'
    });

    cy.wait('@createProduct');
  });

  // b) READ / LIST PRODUCTS
  it('should display product list', () => {
    productsPage.getProductList().should('have.length', 3);
    productsPage.getProductByName('Widget A').should('exist');
  });

  // c) UPDATE PRODUCT
  it('should edit product successfully', () => {
    cy.intercept('PUT', '/api/products/*', { statusCode: 200 }).as('updateProduct');

    productsPage.getEditButton('Widget A').click();
    productsPage.updateProduct({
      name: 'Widget A Updated',
      price: '99'
    });

    cy.wait('@updateProduct');
  });

  // d) DELETE PRODUCT
  it('should delete product', () => {
    cy.intercept('DELETE', '/api/products/*', { statusCode: 204 }).as('deleteProduct');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });

    productsPage.getDeleteButton('Widget A').click();
    cy.wait('@deleteProduct');
  });

  // e) SEARCH / FILTER
  it('should filter products by name (case-insensitive)', () => {
    productsPage.searchFor('gIz');
    productsPage.getProductList().should('have.length', 1);
    productsPage.getProductByName('Gizmo B').should('exist');
  });
});