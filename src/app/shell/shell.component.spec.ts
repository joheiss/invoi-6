import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShellComponent} from './shell.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../shared/material.module';
import {Store} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import {NaviHeaderComponent} from '../containers/navigation/navi-header/navi-header.component';
import {NaviSidebarComponent} from '../containers/navigation/navi-sidebar/navi-sidebar.component';
import {QueryAuth} from '../../auth/store/actions';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {UsersUiService} from '../../auth/services';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {generateUserProfile} from '../../test/test-generators';
import {last} from 'rxjs/operators';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule],
      declarations: [ShellComponent, NaviHeaderComponent, NaviSidebarComponent],
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


  describe('ngOnInit()', () => {
    it('should dispatch the QueryAuth action in ngOnInit lifecycle event', () => {
      const action = new QueryAuth();
      const store = TestBed.get(Store);
      const spy = jest.spyOn(store, 'dispatch');
      fixture.detectChanges();
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });

  it('should select the current state of the spinner', () => {
    const store = TestBed.get(Store);
    const isSpinning = true;
    store.pipe = jest.fn(() => hot('-a', {a: isSpinning}));
    fixture.detectChanges();
    const expected = cold('-a', {a: isSpinning});
    return expect(component.isSpinning$).toBeObservable(expected);
  });

  it('should select the current auth object', () => {
    const store = TestBed.get(Store);
    const auth = generateUserProfile();
    store.pipe = jest.fn(() => hot('-a', {a: auth}));
    fixture.detectChanges();
    const expected = cold('-a', {a: auth});
    return expect(component.auth$).toBeObservable(expected);
  });

  it('should select the currently authenticated user', () => {
    const store = TestBed.get(Store);
    const user = generateUserProfile();
    store.pipe = jest.fn(() => hot('-a', {a: user}));
    fixture.detectChanges();
    const expected = cold('-a', {a: user});
    return expect(component.user$).toBeObservable(expected);
  });

  describe('user$', () => {
    it('should be an observable of a single UserProfile object', done => {
      const store = TestBed.get(Store);
      const user = generateUserProfile();
      const bullshit = { ...generateUserProfile(), displayName: 'Bullshit' };
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
