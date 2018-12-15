import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ContractsBusinessService} from '../business-services';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ContractFormComponent} from '../components';
import {Store} from '@ngrx/store';
import {AppState} from '../../app/store/reducers';
import {I18nUtilityService} from '../../shared/i18n-utility/i18n-utility.service';
import {SharedModule} from '../../shared/shared.module';
import {FormGroup} from '@angular/forms';
import {Back} from '../../app/store/actions';
import {Contract} from '../models/contract.model';
import {mockSingleContract} from '../../test/factories/mock-contracts.factory';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {of} from 'rxjs/internal/observable/of';
import {mockAuth} from '../../test/factories/mock-auth.factory';

describe('Abstract Details Form Component', () => {

  let component: ContractFormComponent;
  let fixture: ComponentFixture<ContractFormComponent>;
  let service: ContractsBusinessService;
  let store: Store<AppState>;
  let utility: I18nUtilityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [ContractFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        {
          provide: ContractsBusinessService,
          useValue: {
            change: jest.fn(),
            copy: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            new: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => of(mockAuth()[0])),
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.get(ContractsBusinessService);
    utility = TestBed.get(I18nUtilityService);
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(ContractFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component['buildForm'] = jest.fn(() => new FormGroup({}));
      component['patchForm'] = jest.fn();
      component['listenToChanges'] = jest.fn();
      component.object = Contract.createFromData(mockSingleContract());
      component.form =  new FormGroup({});
    });

    it('should initialize the document link changes', async  () => {
      await component.ngOnInit();
      expect(component.changedDocumentLinks).toEqual([]);
    });

    it('should build and patch the form and listen to changes when the form is initially built', async  () => {
      component.form = undefined;
      const spyBuild = jest.spyOn<any, any>(component, 'buildForm');
      const spyPatch = jest.spyOn<any, any>(component, 'patchForm');
      const spyListen = jest.spyOn<any, any>(component, 'listenToChanges');
      await component.ngOnChanges({});
      await expect(spyBuild).toHaveBeenCalled();
      await expect(spyPatch).toHaveBeenCalled();
      return expect(spyListen).toHaveBeenCalled();
    });

    it('should only patch the form in case of changes when the form has already been built', async  () => {
      const spyBuild = jest.spyOn<any, any>(component, 'buildForm');
      const spyPatch = jest.spyOn<any, any>(component, 'patchForm');
      const spyListen = jest.spyOn<any, any>(component, 'listenToChanges');
      await component.ngOnChanges({});
      await expect(spyBuild).not.toHaveBeenCalled();
      await expect(spyPatch).toHaveBeenCalled();
      return expect(spyListen).not.toHaveBeenCalled();
    });

    it('should dispatch Back action when onCancel is handled', async () => {
      const action = new Back();
      const spy = spyOn(store, 'dispatch');
      component.onCancel(new Event('click'));
      return expect(spy).toHaveBeenCalledWith(action);
    });

    it('should emit copy event and reset the form when onCopy is handled', async() => {
      const spy = jest.spyOn(component.copy, 'emit');
      const spyReset = jest.spyOn(component.form, 'reset');
      component.onCopy(new Event('click'));
      await expect(spy).toHaveBeenCalledWith(component.object);
      return expect(spyReset).toHaveBeenCalled();
    });

    it('should emit delete event when onDelete is handled', async() => {
      const spy = jest.spyOn(component.delete, 'emit');
      component.onDelete(new Event('click'));
      return expect(spy).toHaveBeenCalledWith(component.object);
    });

    it('should emit new event and reset the form when onNew is handled', async() => {
      const spy = jest.spyOn(component.new, 'emit');
      const spyReset = jest.spyOn(component.form, 'reset');
      component.onNew(new Event('click'));
      await expect(spy).toHaveBeenCalled();
      return expect(spyReset).toHaveBeenCalled();
    });

    it('should emit create event and reset the form when onSave is handled for a newly created object', async() => {
      const newObject = { header: { id: undefined } };
      const spyCreate = jest.spyOn(component.create, 'emit');
      const spyUpdate = jest.spyOn(component.update, 'emit');
      const spyReset = jest.spyOn(component.form, 'reset');
      component['changeObject'] = jest.fn(() => newObject);
      component.onSave(component.form);
      await expect(spyCreate).toHaveBeenCalledWith(newObject);
      await expect(spyUpdate).not.toHaveBeenCalled();
      return expect(spyReset).toHaveBeenCalled();
    });

    it('should emit update event and reset the form when onSave is handled for an existing object', async() => {
      const spyCreate = jest.spyOn(component.create, 'emit');
      const spyUpdate = jest.spyOn(component.update, 'emit');
      const spyReset = jest.spyOn(component.form, 'reset');
      component['changeObject'] = jest.fn(() => component.object);
      component.onSave(component.form);
      await expect(spyCreate).not.toHaveBeenCalled();
      await expect(spyUpdate).toHaveBeenCalledWith(component.object);
      return expect(spyReset).toHaveBeenCalled();
    });
  });
});



