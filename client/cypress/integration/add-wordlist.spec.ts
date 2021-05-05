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

  it('Should type a word and get suggestions', () => {
    page.typeWord({ word: 'Chicken', forms: [], type: 'noun' });
    cy.wait(3000);
    page.addWordButton().should('be.enabled');
    cy.get('.chip').should('have.length.greaterThan',0);
  });

  it('Should type a word and remove suggestions', () => {
    page.typeWord({ word: 'Chicken', forms: [], type: 'noun' });
    cy.wait(3000);
    page.addWordButton().should('be.enabled');
    cy.get('.chip').should('have.length',2);
    cy.get('.mat-chip-remove').first().click();
    cy.get('.chip').should('have.length',1);
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

  it('Add form works for valid input', () => {
    page.addForms(['form1','form2']);
    page.getForms().should('have.length', '2');
    page.addForms(['form3','form4']);
    page.getForms().should('have.length', '4');
  });

  it('Should remove a form', () => {
    page.addForms(['form1','form2']);
    page.getForms().should('have.length', '2');
    cy.get('.mat-chip-remove').first().click();
    page.getForms().should('have.length', '1');
  });


});
