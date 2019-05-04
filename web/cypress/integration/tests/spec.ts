/// <reference types="cypress" />
import {AppPage} from '../../support/app.po';

describe('Invoicing Application', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should have an app root', () => {
    page.getAppRoot().should('exist');
  });

  describe('App Shell', () => {
    it('should contain the app shell', () => {
      page.getShell().should('exist');
    });

    describe('Navigation Side Bar', () => {
      it('should contain the navigation side bar', () => {
       page.getNaviSidebar().should('exist');
      });
    });

    describe('Navigation Header', () => {
      it('should contain the navigation header', () => {
       page.getNaviHeader().should('exist');
      });
      it('should contain a login button', () => {
       page.getNaviHeaderLoginButton().contains('Anmelden');
      });
      it('should navigate to login when login button is pressed', () => {
        page.getNaviHeaderLoginButton().click();
        page.getLogin().should('exist');
      });
      describe('Login', () => {
        it('should navigate to invoicing overview after successful login', () => {
          page.getNaviHeaderLoginButton().click();
          page.getLogin().should('exist');
          page.loginSuccessfully();
          page.getInvoicing().should('exist');
        });
      });
    });
  });
});
