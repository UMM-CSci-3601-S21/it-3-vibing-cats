export class LoginPage {
    navigateTo() {
        return cy.visit('/');
    }

    loginButton() {
        return cy.get(`[data-test=loginButton]`);
    }
    loginEmail() {
        return cy.get(`[data-test=loginEmail]`);
    }
    loginPassword() {
      return cy.get(`[data-test=loginPassword]`);
    }

    login(){
        this.loginEmail().type('cats4@gmail.com');
        this.loginPassword().type('VibingCats');
        this.loginButton().click();
    }
}
