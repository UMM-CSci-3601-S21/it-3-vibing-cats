import { AddWordListPage } from '../support/add-wordlist.po';
import { LoginPage } from 'cypress/support/login.po';

describe('Add Wordlist', () => {
  const page = new AddWordListPage();
  const loginPage = new LoginPage();


  // before(()=> {
  //   loginPage.navigateTo();
  //   loginPage.login();
  //   cy.wait(1000);
  // });

  beforeEach(() => {
    cy.task('seed:database');
    page.navigateTo();
  });


  it('Should enable and disable the save button', () => {
    page.addWordListButton().should('be.disabled');
    page.getWordListName().type('sada');
    page.addWordListButton().should('be.enabled');
  });

  it('Should not enable the save button if the word list name contains special character or punctuation', () => {
    page.addWordListButton().should('be.disabled');
    page.getWordListName().type('أنا أحبك?+;');
    page.addWordListButton().should('be.disabled');
  });

  it('Should add a word', () => {
    page.addWord({ word: 'Boo', forms: [], type: 'nouns' });
    page.getWordCards().should('have.length', '1');
  });


  it('Should delete a word', () => {
    page.addWord({ word: 'Joshua', forms: [], type: 'nouns' });
    page.getWordCards().should('have.length', '1');
    cy.get('.word-card').first().trigger('mouseover');
    page.deleteWordButton().eq(1).click({ force: true });
    page.getWordCards().should('have.length', '0');
  });
  it('Should type a word and get a suggestion', () => {
    page.typeWord({ word: 'Chicken', forms: [], type: 'noun' });
    cy.wait(2000);
    page.addWordButton().should('be.enabled');

  });

  it('Should add a wordlist', () => {
    page.addWordList({
      name: 'funpacks',
      enabled: true,
      nouns: [{ word: 'clown', forms: ['clowns'] }],
      adjectives: [{ word: 'heavy', forms: ['heavy', 'heavier', 'heavily'] }],
      verbs: [{ word: 'laugh', forms: ['laugh', 'laughing', 'laughed'] }],
      misc: [{ word: 'to', forms: [] }]
    });
    cy.url().should(url => expect(url.endsWith('/packs/605bc9d893b2d94300a98753')).to.be.true);
  });

  it('Should fail to add a duplicate word list', () => {
    page.addWordList({
      name: 'birthday',
      enabled: true,
      nouns: [{ word: 'clown', forms: ['clowns'] }],
      adjectives: [{ word: 'heavy', forms: ['heavy', 'heavier', 'heavily'] }],
      verbs: [{ word: 'laugh', forms: ['laugh', 'laughing', 'laughed'] }],
      misc: [{ word: 'to', forms: [] }]
    });
    cy.get('.mat-simple-snackbar').should('be.visible');
  });

  it('Should add a field initially', () => {
    page.getInitialButton().click();
    page.getFormItems().should('have.length', '1');
  });
  it('Add form button does not work for empty input', () => {
    page.getInitialButton().click();
    page.getAddFormButton().click();
    page.getFormItems().should('have.length', '1');
  });
  it('Add form works for valid input', () => {
    page.getInitialButton().click();
    page.getFormItems().should('have.length', '1');
    page.getFormField().last().type('sdas');
    page.getAddFormButton().last().click();
    page.getFormItems().should('have.length', '2');
  });
  it('Should remove a form', () => {
    page.getFormField().last().type('sdas');
    page.getAddFormButton().last().click();
    page.getForms().should('have.length', '2');
    page.getRemoveButton().last().click();
    page.getForms().should('have.length', '1');
  });
  it('Should remove multiple forms', () => {
    page.getFormField().last().type('sample text 1');
    page.getAddFormButton().last().click();
    page.getFormField().last().type('sample text 2');
    page.getAddFormButton().last().click();
    page.getFormField().last().type('sample text 3');
    page.getAddFormButton().last().click();
    page.getForms().should('have.length', '4');
    page.getRemoveButton().last().click();
    page.getForms().should('have.length', '3');
    page.getRemoveButton().last().click();
    page.getForms().should('have.length', '2');
    page.getRemoveButton().last().click();
    page.getForms().should('have.length', '1');
  });

});
