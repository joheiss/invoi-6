import {by, element} from 'protractor';

export class AppPage {

  static url = 'http://localhost:4200';

  navigateTo() {
    return cy.visit(AppPage.url);
  }

  getAppRoot() {
    return cy.get('jo-root');
  }
  getHome() {
    return cy.get('main jo-home');
  }

  getInvoicing() {
    return cy.get('main jo-invoicing');
  }
  getLogin() {
    return cy.get('main jo-login');
  }

  getNaviHeader() {
    return cy.get('jo-navi-header');
  }

  getNaviHeaderLoginButton() {
    return cy.get('jo-navi-header [ng-reflect-router-link="/login"]');
  }

  getNaviSidebar() {
    return cy.get('jo-navi-sidebar');
  }

  getRouterOutlet() {
    return cy.get('router-outlet');
  }

  getShell() {
    return cy.get('jo-shell');
  }

  loginSuccessfully() {
    const email = 'willi@horsti.de';
    const pass = 'Hansi123';
    cy.get('input[formControlName="email"]').type(email);
    cy.get('input[formControlName="password"]').type(pass);
    cy.get('button[type="submit"]').click();
  }
}
