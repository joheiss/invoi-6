/// <reference types="jest" />

import { AppPage } from './app.po';

describe('Invoicing App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should contain the app root', () => {
    expect(page.getAppRoot()).toBeTruthy();
  });

  describe('App Shell', () => {
    it('should contain the app shell', () => {
      expect(page.getShell()).toBeTruthy();
    });
    it('should contain a router outlet', () => {
      expect(page.getRouterOutlet()).toBeTruthy();
    });

    describe('Navigation Side Bar', () => {
      it('should contain the navigation side bar', () => {
        expect(page.getNaviSidebar()).toBeTruthy();
      });
    });

    describe('Navigation Header', () => {
      it('should contain the navigation header', () => {
        expect(page.getNaviHeader()).toBeTruthy();
      });
      it('should contain a login button', () => {
        expect(page.getNaviHeaderLoginButton().getText()).toEqual('Anmelden');
      });
      it('should navigate to login when login button is pressed', () => {
        page.getNaviHeaderLoginButton().click();
        expect(page.getLogin()).toBeTruthy();
      });
    });
  });

  it('should contain the home component', () => {
    expect(page.getHome()).toBeTruthy();
  });







  /*
  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
  */
});
