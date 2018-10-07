import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UsersComponent} from './users.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {UsersBusinessService} from '../business-services/users-business.service';
import {UsersUiService} from '../services';
import {cold} from 'jasmine-marbles';
import {generateMoreUserProfiles, generateUserProfile} from '../../test/test-generators';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {User} from '../models/user';

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
            getAllUsers: jest.fn(() => cold('-a|', {a: [generateUserProfile(), ...generateMoreUserProfiles(3)]})),
            new: jest.fn()
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
    service = TestBed.get(UsersBusinessService);
    uiService = TestBed.get(UsersUiService);
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.whenStable().then(() => fixture.detectChanges());
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  it('should invoke onNew handler when create button is pressed', async () => {
    const spy = jest.spyOn(component, 'onNew');
    const buttonDebugEl = fixture.debugElement.query(By.css('button'));
    buttonDebugEl.triggerEventHandler('click', null);
    return expect(spy).toHaveBeenCalled();
  });

  it('should prepare new user and open popup when onNew is handled', async () => {
    const spyNew = jest.spyOn(service, 'new');
    const spyOpenPopup = jest.spyOn(uiService, 'openUserProfilePopup');
    component.onNew();
    await expect(spyNew).toHaveBeenCalled();
    return expect(spyOpenPopup).toHaveBeenCalled();
  });

  it('should prepare selected user and open popup when onSelect is handled', async () => {
    const user = User.createFromData(generateUserProfile());
    const spyOpenPopup = jest.spyOn(uiService, 'openUserProfilePopup');
    component.onSelect(user);
    return expect(spyOpenPopup).toHaveBeenCalled();
  });
});
