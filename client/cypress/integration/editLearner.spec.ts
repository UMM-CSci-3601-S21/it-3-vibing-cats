import { EditLearnerPage } from 'cypress/support/edit-learner.po';
import { LoginPage } from 'cypress/support/login.po';


const page = new EditLearnerPage();
const loginPage = new LoginPage();
describe('Edit Learner', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(()=> {
    loginPage.navigateTo();
    loginPage.login();
    cy.wait(1000);
  });

  it('Should assign and unassign a context pack', () => {
    page.getLearnerCards().first().then((card) => {
      page.clickLearner(page.getLearnerCards().first());
    });
      cy.wait(1000);

      cy.wait(1000);

      cy.url().should('match', /\/learners\/[0-9]+/);

      page.getAssignedPacks().should('have.length', 1);

      page.getCpCards().first().then((cpCard)=> {
        page.unassignPackButton().click();
      });
      cy.wait(1000);
      page.getAssignedPacks().should('have.length', 0);

      page.saveLearnerButton().click();
      cy.wait(1000);
      page.getAssignedPacksCount().eq(1).should('have.text', '0Packs');

      page.getLearnerCards().eq(1).then((card) => {
        page.clickLearner(page.getLearnerCards().eq(1));
      });
      cy.wait(1000);
      cy.url().should('match', /\/learners\/[0-9]+/);

      page.getAssignedPacks().should('have.length', 0);
      page.getCpCards().first().then((cpCard)=> {

      page.assignPackButton().eq(0).click();
        });
      cy.wait(1000);
      page.getAssignedPacks().should('have.length', 1);
      page.saveLearnerButton().click();
      cy.wait(1000);
      page.getAssignedPacksCount().eq(1).should('have.text', '1Packs');
  });

  it('Should change the name of the learner', () => {
    page.getLearnerCards().eq(1).then((card) => {
      page.clickLearner(page.getLearnerCards().eq(1));
    });

      cy.url().should('match', /\/learners\/[0-9]+/);

    page.getNameField().clear();
    page.getNameField().type('Go Tigers');

    page.saveLearnerButton().click();

    page.getLearnerCards().eq(1).then((card) => {
      page.getLearnerCardName().eq(1).should('have.text', 'Go Tigers');
    });
  });

  it('Should delete the learner', () => {
    page.getLearnerCards().eq(1).then((card) => {
      page.clickLearner(page.getLearnerCards().eq(1));
    });

      cy.url().should('match', /\/learners\/[0-9]+/);

      page.getDeleteButton().click();
      page.getConfirmButton().click();
      cy.wait(1000);
      cy.url().should('match', /\/home$/);

      page.getLearnerCards().should('have.length', 1);
  });
});
