import { ProductsPage } from '../support/pages';

describe('Products Page - POM flows', () => {
  const productsPage = new ProductsPage();
  // This test focuses on product listing and search filtering

  beforeEach(() => {
    productsPage.visit();
  });

  it('should display product list and at least one product', () => {
    productsPage.getProductList().should('exist');
    productsPage.getProductItems().its('length').should('be.gte', 1);
  });

  it('should render product list from API fixture', () => {
    cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');
    productsPage.visit();
    cy.wait('@getProducts');
    productsPage.getProductItems().should('have.length', 3);
    productsPage.getProductByName('Widget A').should('exist');
    productsPage.getProductByName('Gizmo B').should('exist');
    productsPage.getProductByName('Accessory C').should('exist');
    // Check a field displayed in list item - price
    productsPage.getProductByName('Widget A').within(() => {
      cy.get('[data-testid="product-price"]').should('contain', '12.5');
    });
  });

  it('should filter products by search term and be case-insensitive', () => {
    cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');
    productsPage.visit();
    cy.wait('@getProducts');
    // Partial search and case-insensitive
    productsPage.searchFor('gIz');
    productsPage.getProductItems().should('have.length', 1);
    productsPage.getProductByName('Gizmo B').should('exist');
  });

  it('should return zero results when no match', () => {
    cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');
    productsPage.visit();
    cy.wait('@getProducts');
    productsPage.searchFor('NoSuchProductXYZ');
    productsPage.getProductItems().should('have.length', 0);
  });

  it('should clear search and show full list', () => {
    cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');
    productsPage.visit();
    cy.wait('@getProducts');
    productsPage.searchFor('Gizmo');
    productsPage.getProductItems().should('have.length', 1);
    productsPage.searchFor('');
    productsPage.getProductItems().should('have.length', 3);
  });

  it('should show price and description in product list items', () => {
    cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');
    productsPage.visit();
    cy.wait('@getProducts');
    productsPage.getProductItems().each(($el) => {
      cy.wrap($el).find('[data-testid="product-price"]').should('be.visible');
      cy.wrap($el).find('.line-clamp-2').should('exist');
    });
  });

  it('should display no products message when API fails', () => {
    cy.intercept('GET', '/api/products', { statusCode: 500, body: {} }).as('getProductsFail');
    productsPage.visit();
    cy.wait('@getProductsFail');
    // No products are shown
    productsPage.getProductItems().should('have.length', 0);
    cy.contains('No products yet').should('be.visible');
  });

  // No product detail or cart behavior in admin listing — tests kept to list & search functionality
});
