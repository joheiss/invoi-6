import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UsersComponent} from './users.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {UsersBusinessService} from '../business-services';
import {UsersUiService} from '../services';
import {cold} from 'jasmine-marbles';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {mockAllUsers, mockSingleUser} from '../../test/factories/mock-users.factory';
import {User, UserFactory} from 'jovisco-domain';

describe('Users Component', () => {

  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let service: UsersBusinessService;
  let uiService: UsersUiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule],
      declarations: [UsersComponent],
      providers: [
        {
          provide: UsersBusinessService,
          useValue: {
            getAllUsers: jest.fn(() => cold('-a|', {
              a: UserFactory.fromDataArray(mockAllUsers()).slice(0, 4)
            })),
            new: jest.fn(() => User.defaultValues())
          }
        },
        {
          provide: UsersUiService,
          useValue: {
            openUserProfilePopup: jest.fn()
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(UsersBusinessService);
    uiService = TestBed.inject(UsersUiService);
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('View', () => {
    beforeEach(async () => {
      component.dataSource.data = UserFactory.fromDataArray(mockAllUsers()).slice(0, 4);
      fixture.detectChanges();
    });

    it('should show the create and the back button', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('#btn_create'));
      await expect(de).toBeTruthy();
      de = fixture.debugElement.query(By.css('#btn_back'));
      return expect(de).toBeTruthy();
    });

    it('should show a table with header line and 4 lines with users', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('mat-table'));
      await expect(de).toBeTruthy();
      const count = de.children.length;
      await expect(count).toBe(5);
      de = fixture.debugElement.query(By.css('mat-table mat-header-row'));
      await expect(de).toBeTruthy();
    });

    it('should invoke onNew handler when create button is pressed', async () => {
      const spy = jest.spyOn(component, 'onNew');
      fixture.debugElement.query(By.css('#btn_create')).triggerEventHandler('click', null);
      return expect(spy).toHaveBeenCalled();
    });

    it('should invoke onSelect handler when user is selected', async () => {
      const spy = jest.spyOn(component, 'onSelect');
      fixture.debugElement.query(By.css('mat-table mat-row')).triggerEventHandler('click', null);
      return expect(spy).toHaveBeenCalled();
    });
  });

  describe('Controller', () => {

    describe('ngOnInit', () => {

      it('should invoke UserBusinessService.getAllUsers', async () => {
        const spy = jest.spyOn(service, 'getAllUsers');
        component.ngOnInit();
        return expect(spy).toHaveBeenCalled();
      });
    });

    describe('onNew', () => {
      it('should invoke UserBusinessService.new and UsersUiService.openUserProfilePopup', async () => {
        console.log('new output: ', service.new());
        const spyNew = jest.spyOn(service, 'new');
        const spyOpenPopup = jest.spyOn(uiService, 'openUserProfilePopup');
        component.onNew();
        await expect(spyNew).toHaveBeenCalled();
        return expect(spyOpenPopup).toHaveBeenCalled();
      });
    });

    describe('onSelect', () => {
      it('should invoke UsersUiService.openUserProfilePopup', async () => {
        const user =  UserFactory.fromData(mockSingleUser());
        const spyOpenPopup = jest.spyOn(uiService, 'openUserProfilePopup');
        component.onSelect(user);
        return expect(spyOpenPopup).toHaveBeenCalled();
      });
    });
  });
});
