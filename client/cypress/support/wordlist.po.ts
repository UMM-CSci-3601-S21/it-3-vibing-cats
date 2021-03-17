export class WordListPage {
    navigateTo() {
      return cy.visit('/wordlist');
    }

    getWordListCards() {
        return cy.get('.wordlist-cards-container app-wordlist-card');
    }

    clickViewWordList(card: Cypress.Chainable<JQuery<HTMLElement>>) {
        return card.find<HTMLButtonElement>('[viewWordListButton]').click();
    }

    clickAddWordList(card: Cypress.Chainable<JQuery<HTMLElement>>) {
        return card.find<HTMLButtonElement>('[addWordListButton]').click();
    }

    clickImportWordList(card: Cypress.Chainable<JQuery<HTMLElement>>) {
        return card.find<HTMLButtonElement>('[importWordListButton]').click();
    }

    saveWordListButton() {
        return cy.get('[data-test=confirmAddWordListButton]');
      }
}
