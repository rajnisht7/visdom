describe('Visdom - Upload Dashboard JSON Feature', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.visdom-title', { timeout: 15000 }).should('be.visible');
  });

  it('should display Upload JSON button', () => {
    cy.get('button .glyphicon-upload')
      .should('be.visible')
      .parent('button')
      .should('be.visible');
  });

  it('should reject non-JSON files', () => {
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from('This is not json'),
        fileName: 'test.txt',
        mimeType: 'text/plain',
      },
      { force: true }
    );

    cy.get('button .glyphicon-upload').parent('button').click();

    cy.on('window:alert', (str) => {
      expect(str.toLowerCase()).to.contain('json');
    });
  });

  it('should successfully upload valid dashboard JSON', () => {
    cy.fixture('main.json').then((fileContent) => {
      cy.get('input[type="file"]').selectFile(
        {
          contents: fileContent,
          fileName: 'main1.json',
          mimeType: 'application/json',
        },
        { force: true }
      );

      cy.get('button .glyphicon-upload').parent('button').click();

      cy.on('window:alert', (alertText) => {
        expect(alertText.toLowerCase()).to.match(/loaded|success|uploaded/);
      });
    });
  });

  it('should switch to the newly uploaded environment', () => {
    cy.get('.rc-tree-select', { timeout: 15000 }).should('be.visible').click();

    cy.get(
      '.rc-tree-select-dropdown .rc-tree-select-tree-node-content-wrapper',
      { timeout: 15000 }
    )
      .contains('uploaded_', { timeout: 15000 })
      .should('be.visible')
      .click();

    cy.get('.rc-tree-select-selection__choice__content').should(
      'contain',
      'uploaded_'
    );
  });

  it('should show uploaded environment in the environment list', () => {
    cy.get('.rc-tree-select').click();
    cy.get('.rc-tree-select-dropdown').should('contain', 'uploaded_');
  });
});
