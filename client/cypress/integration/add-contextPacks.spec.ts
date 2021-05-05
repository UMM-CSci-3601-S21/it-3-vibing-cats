import { ContextPack } from 'src/app/datatypes/contextPacks';
import { AddContextPackPage } from '../support/add-contextPack.po';
import { WordList } from 'src/app/datatypes/wordlist';
import { LoginPage } from 'cypress/support/login.po';

describe('Add Context Pack', () => {
    const page = new AddContextPackPage();
    const loginPage = new LoginPage();

   beforeEach(()=> {
     loginPage.navigateTo();
     loginPage.login();
     cy.wait(1000);
   });

   beforeEach(() => {
        page.navigateTo();
    });

    // it('Should have the correct title', () => {
    //     page.getTitle().should('have.text','New Context Pack');
    // });

    it('Should enable and disable the context pack', () => {
     page.getEnabledButton().should('have.class', 'selected');
     page.getDisabledButton().click();
     page.getEnabledButton().should('have.class', 'unselected');
     page.getDisabledButton().should('have.class', 'selected');
    });

   it('Should show error messages for invalid inputs', () => {
     //Before doing anything there shouldn't be an error
     cy.get('[data-test=nameError]').should('not.exist');

     //Just clicking the name field without entering anything should cause an error message
     page.getFormField('name').click().blur();
     cy.get('[data-test=nameError]').should('exist').and('be.visible');

     page.getFormField('name').clear().type('This is a very long name that goes beyond the 50 character limit');
     cy.get('[data-test=nameError]').should('exist').and('be.visible');

     //Entering a valid name should remove the error.
     page.getFormField('name').clear().type('Iron Man').blur();
     cy.get('[data-test=nameError]').should('not.exist');

   });

  it('Should add a valid name and enable field and then click the upload image button', () => {
    page.getFormField('name').type('Testing Pack');
    cy.get('.btn-2').click();
 });
});
