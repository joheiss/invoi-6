import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ShellComponent} from './shell.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../shared/material.module';
import {Store} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import {NaviHeaderComponent} from '../containers/navigation/navi-header/navi-header.component';
import {NaviSidebarComponent} from '../containers/navigation/navi-sidebar/navi-sidebar.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {UsersUiService} from '../../auth/services';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {last} from 'rxjs/operators';
import {mockSingleUser} from '../../test/factories/mock-users.factory';
import {mockAuth} from '../../test/factories/mock-auth.factory';
import {IfAuthorizedForSalesDirective} from '../../auth/directives/if-authorized-for-sales.directive';
import {IfAuthorizedForAdminDirective} from '../../auth/directives/if-authorized-for-admin.directive';
import {IfAuthorizedAsDirective} from '../../shared/directives/if-authorized-as.directive';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule],
      declarations: [
        ShellComponent, NaviHeaderComponent, NaviSidebarComponent,
        IfAuthorizedForSalesDirective, IfAuthorizedForAdminDirective, IfAuthorizedAsDirective
      ],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          }
        },
        {
          provide: UsersUiService,
          useValue: {
            openPasswordChangePopup: jest.fn(),
            openUserProfilePopup: jest.fn()
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    return expect(component).toBeTruthy();
  });

  it('should select the current state of the spinner', () => {
    const store = TestBed.inject(Store);
    const isSpinning = true;
    store.pipe = jest.fn(() => hot('-a', {a: isSpinning}));
    fixture.detectChanges();
    const expected = cold('-a', {a: isSpinning});
    return expect(component.isSpinning$).toBeObservable(expected);
  });

  it('should select the current auth object', () => {
    const store = TestBed.inject(Store);
    const auth = mockAuth()[0];
    store.pipe = jest.fn(() => hot('-a', {a: auth}));
    fixture.detectChanges();
    const expected = cold('-a', {a: auth});
    return expect(component.auth$).toBeObservable(expected);
  });

  it('should select the currently authenticated user', () => {
    const store = TestBed.inject(Store);
    const user = mockSingleUser();
    store.pipe = jest.fn(() => hot('-a', {a: user}));
    fixture.detectChanges();
    const expected = cold('-a', {a: user});
    return expect(component.user$).toBeObservable(expected);
  });

  describe('user$', () => {
    it('should be an observable of a single UserProfile object', done => {
      const store = TestBed.inject(Store);
      const user = mockSingleUser();
      const bullshit = { ...mockSingleUser(), displayName: 'Bullshit' };
      store.pipe = jest.fn(() => cold('-a|', {a: user}));
      fixture.detectChanges();
      component.user$.pipe(last()).subscribe(user => {
        expect(user).toEqual(user);
        expect(user).not.toEqual(bullshit);
        done();
      });
      getTestScheduler().flush();
    });
  });
});

