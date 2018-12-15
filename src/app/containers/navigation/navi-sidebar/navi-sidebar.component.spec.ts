import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../../../shared/material.module';
import {By} from '@angular/platform-browser';
import {EMPTY, of} from 'rxjs/index';
import {NaviSidebarComponent} from './navi-sidebar.component';
import {mockAuth} from '../../../../test/factories/mock-auth.factory';
import {IfAuthorizedForAdminDirective} from '../../../../auth/directives/if-authorized-for-admin.directive';
import {IfAuthorizedForSalesDirective} from '../../../../auth/directives/if-authorized-for-sales.directive';
import {IfAuthorizedAsDirective} from '../../../../shared/directives/if-authorized-as.directive';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';

describe('NaviSidebarComponent', () => {
  let component: NaviSidebarComponent;
  let fixture: ComponentFixture<NaviSidebarComponent>;
  let store: Store<AppState>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule],
      declarations: [NaviSidebarComponent, IfAuthorizedForAdminDirective, IfAuthorizedForSalesDirective, IfAuthorizedAsDirective],
      providers: [
        {
          provide: Store,
          useValue: {
            pipe: jest.fn(() => of(mockAuth()[0]))
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaviSidebarComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  describe('Menu Items', () => {
    it('should display only the login link if not authenticated', async () => {
      component.auth$ = null;
      store.pipe = jest.fn(() => EMPTY);
      fixture.detectChanges();
      const debugElems = fixture.debugElement.queryAll(By.css('a'));
      return expect(debugElems.length).toBe(1);
    });

    it('should display only the sales items if authenticated as sales-user', async () => {
      const auth = mockAuth()[0];
      auth.roles = ['sales-user'];
      component.auth$ = of(auth);
      store.pipe = jest.fn(() => of(mockAuth(['sales-user'])[0]));
      fixture.detectChanges();
      const debugElems = fixture.debugElement.queryAll(By.css('a'));
      return expect(debugElems.length).toBe(5);
    });

    it('should display only the admin items if authenticated as admin user', async () => {
      const auth = mockAuth()[0];
      auth.roles = ['sys-admin'];
      component.auth$ = of(auth);
      store.pipe = jest.fn(() => of(mockAuth(['sys-admin'])[0]));
      fixture.detectChanges();
      const debugElems = fixture.debugElement.queryAll(By.css('a'));
      return expect(debugElems.length).toBe(3);
    });
  });
});
