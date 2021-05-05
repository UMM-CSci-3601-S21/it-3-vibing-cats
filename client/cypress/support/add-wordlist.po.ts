import { WordList } from 'src/app/datatypes/wordlist';

export class AddWordListPage {
  navigateTo() {
    return cy.visit('/packs/605bc9d893b2d94300a98753/new');
  }

  addWordListButton() {
    return cy.get('[data-test=confirmAddWordListButton]');
  }
  addWordButton() {
    return cy.get('[data-test=confirmAddWordButton]');
  }

  wordTextField() {
    return cy.get('[data-test=newWord]');
  }

  getWordListName() {
    return cy.get(`[data-test=currentName]`);
  }
  getWordName() {
    return cy.get(`[data-test=newWord]`);
  }

  getFormItems() {
    return cy.get('.form_item');
  }

  getInitialButton() {
    return cy.get('.add-form-btn');
  }
  getAddFormButton() {
    return cy.get('#add-form-button');
  }
  getFormField() {
    return cy.get('#formField');
  }
  getWordCards() {
    return cy.get('.wordcard');
  }

  getForms() {
    return cy.get('.chip');
  }

  getRemoveButton() {
    return cy.get('.remove-form');
  }
  addWordList(newWordlist: WordList) {
    this.getWordListName().type(newWordlist.name);
    this.addWord({ word: 'gg', type: 'nouns' });
    return this.addWordListButton().click();
  }
  addWord(newWord) {
    this.getWordName().type(newWord.word);
    this.selectMatSelectType(newWord.type);
    return this.addWordButton().click();
  }
  selectMatSelectType(type: string) {
    // Find and click the drop down
    return cy.get('#select').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${type}"]`).click();
  }

  addForms(forms: string[]){
    forms.forEach(form=>{
      cy.get('#formField').type(form);
      cy.get('#formField').type(',');
    });
  }


  deleteWordButton() {
    return cy.get('[data-test=deleteWordButton]');
  }
  typeWord(newWord) {
    this.getWordName().type(newWord.word);

  }
}
