import {ContextPack} from 'src/app/datatypes/contextPacks';

export class AddContextPackPage {
  navigateTo() {
    return cy.visit('/packs/new');
  }

  getTitle() {
    return cy.get('.add-cp-title');
  }

  addContextPackButton() {
    return cy.get('[data-test=addCpButton]');
  }

  getEnabledButton(){
    return cy.get('[data-test=enabledButton]');
  }
  getDisabledButton(){
    return cy.get('[data-test=disabledButton]');
  }

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formControlName=${fieldName}]`);
  }

  addContextPack(newContextPack: ContextPack) {
    this.getFormField('name').type(newContextPack.name);
    return this.addContextPackButton().click();
  }

  navigateToHome() {
    return cy.visit('/home');
  }

  getCpCards() {
   return cy.get('.context-pack-display app-cp-card');
  }

  getUploadButton() {
    return cy.get('[data-test=upload-image]');
  }
}
