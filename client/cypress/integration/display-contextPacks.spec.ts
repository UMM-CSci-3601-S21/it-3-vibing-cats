import { LoginPage } from 'cypress/support/login.po';
import { DisplayContextPacksComponent } from '../support/display-contextPacks.po';

const page = new DisplayContextPacksComponent();
const loginPage = new LoginPage();

describe('Display Context Pack', () => {

  beforeEach(()=> {
    loginPage.navigateTo();
    loginPage.login();
    cy.wait(1000);
  });
    beforeEach(() => {
        page.navigateTo();
        cy.task('seed:database');
    });

    it('Should have 3 context packs', () => {
        page.getCpCards().should('have.length', 3);
    });

    it('Should click "View Context Pack" on a context pack and lead to a valid URL', () => {
        page.getCpCards().first().then((card) => {
            page.clickViewCp(page.getCpCards().first());

            cy.url().should('match', /\/packs\/[0-9a-fA-F]{24}/);

        });
    });

    it('Should click "View Context Pack" on a context pack and have one word list', () => {
      cy.wait(1000);
      page.getCpCards().first().then((card) => {

          page.clickViewCp(page.getCpCards().first());

          cy.url().should('match', /\/packs\/[0-9a-fA-F]{24}/);

         page.getWordListCards().should('have.length', 1);
      });
    });

    it('Should click add context pack and go to the right URL',() => {
        page.addCpButton().click();
        cy.url().should(url => expect(url.endsWith('/packs/new')).to.be.true);
        cy.get('.add-cp-title').should('have.text', 'New Context Pack');
    });

    it('Should click Delete Context Pack and remove the context pack from the page',() => {
        page.clickDeleteCp(page.getCpCards().first());
        page.getDeleteCpConfirmation(page.getCpCards().first());
        page.getCpCards().should('have.length', 2);
    });

    it('Should have 2 learners', () => {
      cy.wait(4000);
      page.getLearnerCards().should('have.length', 2);
    });

    it('should click on a learner and lead to a valid URL', () => {
      page.getLearnerCards().first().then((card) => {
        page.clickLearner(page.getLearnerCards().first());

        cy.url().should('match', /\/learners\/[0-9]+/);

      });
    });
    it('should click add learner and go to the right URL', () => {
      page.addLearnerButton().click();
      cy.url().should(url => expect(url.endsWith('/learners/new')).to.be.true);
    });
});
