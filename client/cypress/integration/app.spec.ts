import { LoginPage } from 'cypress/support/login.po';
import { AppPage } from '../support/app.po';

const page = new AppPage();
const loginPage = new LoginPage();

describe('App', () => {
  beforeEach(()=> {
    loginPage.navigateTo();
    loginPage.login();
    cy.wait(1000);
  });

  beforeEach(() => page.navigateTo());

  it('Should click the home button and navigate to the home page', () => {
    cy.wait(1000);
    page.getHomeButton();
    cy.url().should('match', /\/home$/);
  });

  it('Should go back to home page when back button is clicked from add context pack', () => {
    page.navigateToContextPackNew();
    page.getBackButton().click();
    cy.url().should('match', /\/home$/);
  });

  it('Should go back to home page when back button is clicked from display wordlists', () => {
    page.navigateToPack();
    cy.wait(1000);
    page.getBackButton().click();
    cy.url().should('match', /\/home$/);
  });

  it('Should go back to context pack page when back button is clicked from view wordlist', () => {
    page.navigateToViewWordList();
    page.getBackButton().click();
    cy.url().should('match', /^(http:\/\/|https:\/\/)localhost:.{1,5}\/?packs\/.{24}\/?$/g);
  });

  it('Should go back to the contextPack page when back button is clicked from import wordlist', () => {
    page.navigateToImportPage();
    page.getBackButton().click();
    cy.url().should('match', /^(http:\/\/|https:\/\/)localhost:.{1,5}\/?packs\/.{24}\/?$/g);
  });
  it('Should go back to contextpack page when back button is clicked from add wordlist', () => {
    page.navigateToAddWordList();
    page.getBackButton().click();
    cy.url().should('match', /^(http:\/\/|https:\/\/)localhost:.{1,5}\/?packs\/.{24}\/?$/g);
  });

});
