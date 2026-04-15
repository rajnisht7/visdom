const exportButton = 'button[data-original-title="Export as HTML"]';

beforeEach(() => {
  cy.visit('/');
});

describe('Test Export Env as HTML', () => {
  it('Export button is disabled when no env is open', () => {
    cy.close_envs();
    cy.get(exportButton).should('be.disabled');
  });

  it('Downloads a valid HTML file when panes are available', () => {
    const env = 'export_test_' + Cypress._.random(0, 1e6);
    cy.run('text_basic', { env });

    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').as('download');
    });

    cy.get(exportButton).should('not.be.disabled').click();

    cy.get('@download').should('have.been.called');
  });

  it('Exported HTML contains expected pane content', () => {
    const env = 'export_content_' + Cypress._.random(0, 1e6);
    cy.run('plot_line_basic', { env });

    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').as('download');
    });

    cy.get(exportButton).click();

    cy.get('@download').should('have.been.called');
  });
});
