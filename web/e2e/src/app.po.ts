import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getAppRoot() {
    return element(by.css('jo-root'));
  }

  getHome() {
    return element(by.css('main jo-home'));
  }

  getLogin() {
    return element(by.css('main jo-login'));
  }

  getNaviHeader() {
    return element(by.css('jo-navi-header'));
  }

  getNaviHeaderLoginButton() {
    return element(by.css('jo-navi-header [ng-reflect-router-link="/login"]'));
  }

  getNaviSidebar() {
    return element(by.css('jo-navi-sidebar'));
  }

  getRouterOutlet() {
    return element(by.css('router-outlet'));
  }

  getShell() {
    return element(by.css('jo-shell'));
  }
}
