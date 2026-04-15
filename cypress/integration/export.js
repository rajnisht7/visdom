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

    cy.get(exportButton).should('not.be.disabled').click();

    cy.task('downloads').then((files) => {
      const htmlFiles = files.filter((f) => f.endsWith('.html'));
      expect(htmlFiles.length).to.be.greaterThan(0);
    });
  });

  it('Exported HTML contains expected pane content', () => {
    const env = 'export_content_' + Cypress._.random(0, 1e6);
    cy.run('plot_line_basic', { env });

    cy.get(exportButton).click();
    cy.wait(1500);
    cy.task('downloads').then((files) => {
      const latest = files
        .filter((f) => f.endsWith('.html'))
        .sort()
        .pop();

      cy.readFile(`${Cypress.config('downloadsFolder')}/${latest}`).then((html) => {
        expect(html).to.include('"type"');   
        expect(html).to.include('plotly');  
        expect(html).to.include('id="board"'); 
      });
    });
  });
});
