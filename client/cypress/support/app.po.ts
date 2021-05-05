export class AppPage {
  navigateTo() {
    return cy.visit('/home');
  }

  navigateToPack() {
    return cy.visit('/packs/604cdf3c63292e16753345f8');
  }

  navigateToImportPage() {
    return cy.visit('/packs/604cdf3c63292e16753345f8/import');
  }

  navigateToContextPackNew() {
    return cy.visit('/packs/new');
  }

  navigateToAddWordList() {
    return cy.visit('/packs/604cdf3c63292e16753345f8/new');
  }

  navigateToViewWordList() {
    return cy.visit('/packs/604cdf3c63292e16753345f8/birthday');
  }

  getHomeButton() {
    return cy.get('[data-test=home-button]');
  }

  getBackButton() {
    return cy.get('[data-test=back-button]');
  }


}
