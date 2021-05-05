import {Learner} from 'src/app/datatypes/learner';

export class CreateLearnerPage {
  navigateTo() {
    return cy.visit('/learners/new');
  }

  getTitle() {
    return cy.get('.title');
  }

  addLearnerButton() {
    return cy.get('[data-test=addLearnerButton]');
  }

  getNameField(){
    return cy.get('#name');
  }

  createLearner(newLearner: Learner) {
    this.getNameField().type(newLearner.name);
    return this.addLearnerButton().click();
  }

  navigateToHome() {
    return cy.visit('/home');
  }

  getLearnerCards() {
    return cy.get('.learners-display app-learner-card');
  }
}
