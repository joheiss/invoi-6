import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {UsersUiService} from '../../../../auth/services';
import {By} from '@angular/platform-browser';
import {generateUserProfile} from '../../../../test/test-generators';
import {of} from 'rxjs/index';
import {NaviSidebarComponent} from './navi-sidebar.component';

describe('NaviSidebarComponent', () => {
  let component: NaviSidebarComponent;
  let fixture: ComponentFixture<NaviSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule],
      declarations: [NaviSidebarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaviSidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  describe('Menu Items', () => {
    it('should display only the login link if not authenticated', async () => {
      const auth$ = null;
      component.auth$ = auth$;
      fixture.detectChanges();
      const debugElems = fixture.debugElement.queryAll(By.css('a'));
      return expect(debugElems.length).toBe(1);
    });

    it('should display only the sales items if authenticated as sales-user', async () => {
      const auth = generateUserProfile();
      auth.roles = ['sales-user'];
      component.auth$ = of(auth);
      fixture.detectChanges();
      const debugElems = fixture.debugElement.queryAll(By.css('a'));
      return expect(debugElems.length).toBe(5);
    });

    it('should display only the admin items if authenticated as admin user', async () => {
      const auth = generateUserProfile();
      auth.roles = ['sys-admin'];
      component.auth$ = of(auth);
      fixture.detectChanges();
      const debugElems = fixture.debugElement.queryAll(By.css('a'));
      return expect(debugElems.length).toBe(3);
    });
  });
});
