import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ContractItemFormComponent} from '../components';
import {I18nUtilityService} from '../../shared/i18n-utility/i18n-utility.service';
import {SharedModule} from '../../shared/shared.module';
import {FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {of} from 'rxjs/internal/observable/of';
import {mockAuth} from '../../test/factories/mock-auth.factory';

describe('Abstract Details Item Form Component', () => {

  let component: ContractItemFormComponent;
  let fixture: ComponentFixture<ContractItemFormComponent>;
  let utility: I18nUtilityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [ContractItemFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: {
            pipe: jest.fn(() => of(mockAuth()[0])),
          }

        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    utility = TestBed.get(I18nUtilityService);
    fixture = TestBed.createComponent(ContractItemFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.itemGroup =  new FormGroup({});
      component['buildItem'] = jest.fn(() => component.itemGroup = new FormGroup({}));
      component['patchItem'] = jest.fn();
      component['isItemGroupBuilt'] = true;
      component['processFieldChanges'] = jest.fn();
    });

    it('should build and patch the item group when the item group is initially built', async  () => {
      component['isItemGroupBuilt'] = false;
      const spyBuild = jest.spyOn<any, any>(component, 'buildItem');
      const spyPatch = jest.spyOn<any, any>(component, 'patchItem');
      await component.ngOnChanges({});
      await expect(spyBuild).toHaveBeenCalled();
      return expect(spyPatch).toHaveBeenCalled();
    });

    it('should only patch the item group in case of changes when the item group has already been built', async  () => {
      const spyBuild = jest.spyOn<any, any>(component, 'buildItem');
      const spyPatch = jest.spyOn<any, any>(component, 'patchItem');
      await component.ngOnChanges({});
      await expect(spyBuild).not.toHaveBeenCalled();
      return expect(spyPatch).toHaveBeenCalled();
    });

    it('should emit delete event when onDelete is handled', async() => {
      const spy = jest.spyOn(component.delete, 'emit');
      component.onDelete(4);
      return expect(spy).toHaveBeenCalledWith(4);
    });

  });
});



