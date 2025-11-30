import { ProductPage, ProductDetailsPage } from '../support/pages';
import LoginPage from './LoginPage';

describe('Admin Product creation flow - POM', () => {
  const productPage = new ProductPage();
  const productDetailsPage = new ProductDetailsPage();
  const loginPage = new LoginPage();
  let createdProductId = null;

  beforeEach(() => {
    // Login as admin (demo credentials available in README)
    loginPage.loginAs('admin', 'admin123');
    productPage.visit();
    createdProductId = null;
  });

  afterEach(() => {
    // Clean up created product via API if exists
    if (createdProductId) {
      cy.request('DELETE', `http://localhost:8080/api/products/${createdProductId}`)
        .then(() => {
          createdProductId = null;
        });
    }
  });

  it('should open add product form and create product successfully', () => {
    const product = {
      name: `Test Product ${Date.now()}`,
      price: 9.99,
      quantity: 10,
      description: 'This is a test product',
    };

    cy.intercept('POST', '/api/products').as('createProduct');
    productPage.clickAddNew();
    productPage.fillProductForm(product);
    productPage.submitForm();
    cy.wait('@createProduct').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      createdProductId = interception.response.body.id;
    });

    // Verify success message and product present in list
    productPage.getSuccessMessage().should('be.visible');
    productPage.getProductInList(product.name).should('exist');
    // Optional: verify details page contains product info
    productPage.openProductByName(product.name);
    productDetailsPage.getTitle().should('contain', product.name);
  });

  it('should show product in list after creation and allow viewing details', () => {
    const product2 = {
      name: `Test Product View ${Date.now()}`,
      price: 19.99,
      quantity: 5,
      description: 'This is a test product for view',
    };
    cy.intercept('POST', '/api/products').as('createProduct');
    productPage.clickAddNew();
    productPage.fillProductForm(product2);
    productPage.submitForm();
    cy.wait('@createProduct').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      createdProductId = interception.response.body.id;
    });
    productPage.getProductInList(product2.name).should('exist');
    productPage.openProductByName(product2.name);
    productDetailsPage.getTitle().should('contain', product2.name);
    productDetailsPage.getPrice().should('exist');
    productDetailsPage.getDescription().should('exist');
  });

  it('should update an existing product successfully', () => {
    const product = {
      name: `Update Test Product ${Date.now()}`,
      price: 15.0,
      quantity: 7,
      description: 'Product to be updated'
    };
    const updated = {
      name: `Updated Product ${Date.now()}`,
      price: 30.5,
      quantity: 3,
      description: 'Updated description'
    };

    // create product first
    cy.intercept('POST', '/api/products').as('createProduct');
    productPage.clickAddNew();
    productPage.fillProductForm(product);
    productPage.submitForm();
    cy.wait('@createProduct').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      createdProductId = interception.response.body.id;
    });

    // now update the product
    cy.intercept('PUT', '/api/products/*').as('updateProduct');
    productPage.editProductByName(product.name);
    productPage.fillProductForm(updated);
    productPage.submitForm();
    cy.wait('@updateProduct').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      const returned = interception.response.body;
      expect(returned.name).to.eq(updated.name);
      expect(returned.price).to.eq(updated.price);
      expect(returned.quantity).to.eq(updated.quantity);
      // ensure createdProductId points to the same product object for cleanup
      createdProductId = returned.id || createdProductId;
    });

    // Verify the list shows the updated data
    productPage.getProductInList(updated.name).should('exist');
    productPage.getProductInList(product.name).should('not.exist');
    // open detail page and verify updated fields
    productPage.openProductByName(updated.name);
    productDetailsPage.getTitle().should('contain', updated.name);
    productDetailsPage.getPrice().should('contain', `${updated.price}`);
  });

  it('should validate required fields on add product form', () => {
    // Open form and submit without filling fields
    productPage.clickAddNew();
    productPage.submitForm();

    // The app should show validation errors for specific fields
    cy.get('[data-testid="product-name-error"]').should('be.visible');
    cy.get('[data-testid="product-price-error"]').should('be.visible');
    cy.get('[data-testid="product-quantity-error"]').should('be.visible');
  });

  it('should remove the product from the list', () => {
    const productName = `Temporary Product For Deletion ${Date.now()}`;
    // Add a temporary product first (and intercept create to capture id)
    cy.intercept('POST', '/api/products').as('createProduct');
    productPage.clickAddNew();
    productPage.fillProductForm({ name: productName, price: 1.0, quantity: 1 });
    productPage.submitForm();
    cy.wait('@createProduct').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      createdProductId = interception.response.body.id;
    });
    productPage.getProductInList(productName).should('exist');

    // Intercept delete call and assert response
    cy.intercept('DELETE', '/api/products/*').as('deleteProduct');
    productPage.deleteProductByName(productName);
    cy.wait('@deleteProduct').then((interception) => {
      expect([200, 204]).to.include(interception.response.statusCode);
      // Mark as cleaned up so afterEach won't attempt to delete again
      createdProductId = null;
    });
    productPage.getProductInList(productName).should('not.exist');
  });
});
