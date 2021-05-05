export class EditLearnerPage {
  navigateTo() {
    return cy.visit('/packs/604cdf3cbb468a7463ad4d85/Woods');
  }

  getLearnerCards() {
    return cy.get('.learners-display app-learner-card');
  }

  clickLearner(learner: Cypress.Chainable<JQuery<HTMLElement>>) {
    return learner.find<HTMLButtonElement>('[data-test=viewLearnerButton]').click();
  }

  getAssignedPacks() {
    return cy.get('.learnercpholder');
  }

  getCpCards() {
    return cy.get('.cp-card1');
  }
  assignPackButton() {
    return cy.get('[data-test=assignButton]');
  }
  unassignPackButton() {
    return cy.get('[data-test=unassignButton]');
  }

  getNameField(){
    return cy.get('#name');
  }

  saveLearnerButton() {
    return cy.get('[data-test=saveLearnerButton]');
  }

  getLearnerCardName() {
    return cy.get('.name');
  }

  getAssignedPacksCount() {
    return cy.get('.count-container');
  }

  getDeleteButton() {
    return cy.get('#deleteButton');
  }

  getConfirmButton() {
    return cy.get('.confirm');
  }

}
