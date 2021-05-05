
import { LoginPage } from 'cypress/support/login.po';
import { CreateLearnerPage } from 'cypress/support/create-learner.po';
import {Learner} from 'src/app/datatypes/learner';

describe('Create new Learner', () => {
    const page = new CreateLearnerPage();
    const loginPage = new LoginPage();

   beforeEach(()=> {
     loginPage.navigateTo();
     loginPage.login();
     cy.wait(1000);
     cy.task('seed:database');
   });

   beforeEach(() => {
        page.navigateTo();
    });

    it('Should have the correct title', () => {
      cy.wait(1000);
        page.getTitle().should('have.text','Create a student profile');
    });

    it('Should create a new learner', () => {
     cy.wait(1000);
     const newLearner: Learner = {
        _id: '',
        name: 'Pete Doe',
        icon: 'pete.png',
        learnerPacks: [],
      };
      page.createLearner(newLearner);
      cy.url().should('match', /\/home/);
      cy.wait(1000);
      page.getLearnerCards().should('have.length', 3);
    });
});
