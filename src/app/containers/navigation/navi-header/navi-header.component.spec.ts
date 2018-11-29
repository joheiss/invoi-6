import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NaviHeaderComponent} from './navi-header.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {UsersUiService} from '../../../../auth/services';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../../test/factories/mock-auth.factory';
import {IfAuthorizedForAdminDirective} from '../../../../auth/directives/if-authorized-for-admin.directive';
import {IfAuthorizedForSalesDirective} from '../../../../auth/directives/if-authorized-for-sales.directive';

describe('NaviHeaderComponent', () => {
  let component: NaviHeaderComponent;
  let fixture: ComponentFixture<NaviHeaderComponent>;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule],
      declarations: [NaviHeaderComponent, IfAuthorizedForAdminDirective, IfAuthorizedForSalesDirective],
      providers: [
        {
          provide: UsersUiService,
          useValue: {
            openPasswordChangePopup: jest.fn(),
            openUserProfilePopup: jest.fn()
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaviHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  describe('Menu Items', () => {
    it('should display only the Login item if not authenticated', async () => {
      component.auth$ = null;
      fixture.detectChanges();
      const debugElems = fixture.debugElement.queryAll(By.css('ul'));
      await expect(debugElems.length).toBe(2);
      let ulElem: HTMLUListElement;
      ulElem = debugElems[0].nativeElement as HTMLUListElement;
      await expect(ulElem.childElementCount).toBe(0);
      ulElem = debugElems[1].nativeElement as HTMLUListElement;
      await expect(ulElem.childElementCount).toBe(1);
    });

    it('should display only the sales items if authenticated as sales-user', async () => {
      const auth = mockAuth()[0];
      auth.roles = ['sales-user'];
      component.auth$ = of(auth);
      fixture.detectChanges();
      const debugElems = fixture.debugElement.queryAll(By.css('ul'));
      await expect(debugElems.length).toBe(2);
      let ulElem: HTMLUListElement;
      ulElem = debugElems[0].nativeElement as HTMLUListElement;
      await expect(ulElem.childElementCount).toBe(4);
      ulElem = debugElems[1].nativeElement as HTMLUListElement;
      await expect(ulElem.childElementCount).toBe(1);
    });

    it('should display only the admin items if authenticated as admin user', async () => {
      const auth = mockAuth()[0];
      auth.roles = ['sys-admin'];
      component.auth$ = of(auth);
      fixture.detectChanges();
      const debugElems = fixture.debugElement.queryAll(By.css('ul'));
      await expect(debugElems.length).toBe(2);
      let ulElem: HTMLUListElement;
      ulElem = debugElems[0].nativeElement as HTMLUListElement;
      await expect(ulElem.childElementCount).toBe(2);
      ulElem = debugElems[1].nativeElement as HTMLUListElement;
      await expect(ulElem.childElementCount).toBe(1);
    });
  });
});
