import { LoginPage } from 'cypress/support/login.po';
import { WordListPage } from '../support/wordlist.po';

const page = new WordListPage();
const loginPage = new LoginPage();

describe('WordList', () => {

    before(() => {
        cy.task('seed:database');
    });

    beforeEach(() => {
       loginPage.navigateTo();
       loginPage.login();
       cy.wait(1000);
        page.navigateTo();
    });

    it('Should load wordlists', () => {
        cy.wait(2000);
        page.getWordListCards().should('not.have.length', '0');
    });

    it('Should click view wordlist on a wordlist and go to the right URL', () => {
        page.getWordListCards().first().then((card) => {
          page.clickViewWordList(page.getWordListCards().first());
          cy.url().should('match', /^(https?|http):\/\/[^\s$.?#].[^\s]*$/g);
        });
    });

    it('Should click add wordlist and go to the right URL', () => {
        page.addWordListButton().click();
        cy.url().should(url => expect(url.endsWith('/packs/605bc9d893b2d94300a98753/new')).to.be.true);

    });

    it('Should click import wordlist and go to the right URL', () => {
        page.importWordListButton().click();
        cy.url().should(url => expect(url.endsWith('/packs/605bc9d893b2d94300a98753/import')).to.be.true);
    });

    it('Should show a confirmation message when click delete context pack is clicked', () => {
        page.clickDeleteContextPack().click();
        page.getDeleteContextPackConfirmation().should('be.visible');
    });

    it('Should hide the confirmation message when cancel was clicked', () => {
        page.clickDeleteContextPack().click();
        page.getDeleteContextPackConfirmation().should('be.visible');
        page.getDeleteContextPackConfirmationCancel().click();
        page.getDeleteContextPackConfirmation().should('not.exist');
    });

    it('Should delete the context pack when confirmed', () => {
        page.clickDeleteContextPack().click();
        page.getDeleteContextPackConfirmation().should('be.visible');
        page.getDeleteContextPackConfirmDeleteButton().click();
        cy.wait(2000);
        cy.url().should('match', /\/home$/);
        page.getCpCards().should('have.length', 2);

    });

});
