

export class DisplayContextPacksComponent {

    navigateTo() {
        return cy.visit('/home');
    }

    getCpCards() {
        return cy.get('.context-pack-display app-cp-card');
    }
    getLearnerCards() {
      return cy.get('.learners-display app-learner-card');
    }

    addCpButton() {
        return cy.get('[data-test=addCpButton]');
    }

    addLearnerButton() {
      return cy.get('[data-test=addLearnerButton]');
    }


   getWordListCards() {
        return cy.get('.wordlist-cards');
    }

    clickViewCp(pack: Cypress.Chainable<JQuery<HTMLElement>>) {
        return pack.find<HTMLButtonElement>('[data-test=viewContextPackButton]').click();
    }

    clickDeleteCp(pack: Cypress.Chainable<JQuery<HTMLElement>>) {
        return pack.find<HTMLButtonElement>('[data-test=deleteContextPackButton]').click();
    }

    getDeleteCpConfirmation(pack: Cypress.Chainable<JQuery<HTMLElement>>) {
        return pack.find<HTMLButtonElement>('[data-test=deleteConfirmationButton]').click();
    }

    getAssignedPacks() {
      return cy.get('.learner-cps');
    }

    clickLearner(learner: Cypress.Chainable<JQuery<HTMLElement>>) {
      return learner.find<HTMLButtonElement>('[data-test=viewLearnerButton]').click();
    }
}
