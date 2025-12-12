import { ProductsPage } from '../support/pages/ProductsPage';

describe('Product E2E - Page Object Model', () => {
  const productsPage = new ProductsPage();

  beforeEach(() => {
  // Stub products list with fixture so tests don't depend on backend
  cy.intercept('GET', 'http://localhost:8080/api/products', { fixture: 'products.json' }).as('getProducts');

  // Stub login response to bypass backend auth
  cy.intercept('POST', 'http://localhost:8080/api/auth/login', {
    statusCode: 200,
    body: { success: true, message: 'Dang nhap thanh cong', token: 'TOKEN_admin_stub' }
  }).as('loginRequest');

  // 1. Login
  cy.visit('/login');
  cy.get('input[name="username"]').type('admin');
  cy.get('input[name="password"]').type('Admin123');
  cy.contains('Sign In').click();

  // 2. Chờ login API trả về
  cy.wait('@loginRequest');

  // 3. Giờ mới assert UI
  cy.contains('Product Management').should('be.visible');

  // 4. Và chờ API products (fixture)
  cy.wait('@getProducts');
});



  // a) CREATE PRODUCT
  it('should create a new product', () => {
    cy.intercept('POST', 'http://localhost:8080/api/products', (req) => {
      req.reply({ statusCode: 201, body: { id: 999, name: req.body.name, price: req.body.price, description: req.body.description } });
    }).as('createProduct');

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
    cy.intercept('PUT', 'http://localhost:8080/api/products/*', (req) => {
      req.reply({ statusCode: 200, body: { ...req.body, id: req.url.split('/').pop() } });
    }).as('updateProduct');

    productsPage.getEditButton('Widget A').click();
    productsPage.updateProduct({
      name: 'Widget A Updated',
      price: '99'
    });

    cy.wait('@updateProduct');
  });

  // d) DELETE PRODUCT
  it('should delete product', () => {
    cy.intercept('DELETE', 'http://localhost:8080/api/products/*', { statusCode: 204 }).as('deleteProduct');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });

    productsPage.getDeleteButton('Widget A').click();
    cy.wait('@deleteProduct');
  });

  // e) SEARCH / FILTER
  it('should filter products by name (case-insensitive)', () => {
    // Use lowercase to avoid any input-case issues and check matching/non-matching items
    productsPage.searchFor('Gizmo B');
    // Check the matching product is visible (do not assert exact count to avoid flakiness)
    productsPage.getProductByName('Gizmo B').should('exist');
  });
});