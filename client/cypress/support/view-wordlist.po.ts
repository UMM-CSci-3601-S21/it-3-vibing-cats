

export class ViewWordListPage {
  navigateTo() {
    return cy.visit('/packs/604cdf3cbb468a7463ad4d85/Woods');
  }

  getWordCards() {
    return cy.get('.wordgridcards');
  }

  deleteWordListButton() {
    return cy.get('[data-test=deleteWordListButton]');
  }

  toggleConfirmationButton() {
    return cy.get('[data-test=toggle-delete]');
  }
  cancelConfirmationButton() {
    return cy.get('[data-test=cancel-delete]');
  }

  deleteWordButton() {
    return cy.get('[data-test=deleteWordButton]');
  }

  saveWordListButton() {
    return cy.get('[data-test=saveWordListButton]');
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

  addWordButton() {
    return cy.get('[data-test=confirmAddWordButton]');
  }
  getWordName() {
    return cy.get(`[data-test=newWord]`);
  }

  selectMatSelectType(type: string) {
    // Find and click the drop down
    return cy.get('#select').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${type}"]`).click();
  }
  addWord(newWord) {
    this.getWordName().type(newWord.word);
    this.selectMatSelectType(newWord.type);
    return this.addWordButton().click();
  }


  getToggleButton() {
    return cy.get('[data-test=wordListToggle]');
  }

  getWordCardsList() {
    return cy.get('.wordlistcards');
  }
  typeWord(newWord) {
    this.getWordName().type(newWord.word);
  }

  getChipList() {
    return cy.get('.chip');
  }

  getClearFormButton() {
    return cy.get('[data-test=clearFormButton]');
  }

  getXChipButton() {
    return cy.get('.removeForm');
  }

  getAddFormField() {
    return cy.get('#formField');
  }

}
