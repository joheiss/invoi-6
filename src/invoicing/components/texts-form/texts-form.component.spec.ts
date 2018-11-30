import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextsFormComponent} from './texts-form.component';
import {Contract} from '../../models/contract.model';
import {mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '../../../shared/shared.module';

describe('Texts Form Component', () => {
  let component: TextsFormComponent;
  let fixture: ComponentFixture<TextsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [TextsFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextsFormComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.object = Contract.createFromData(mockSingleContract());
      component.isChangeable = true;
      component.textsFormGroup = new FormGroup({
        invoiceText: new FormControl(component.object.header.invoiceText),
        internalText: new FormControl(component.object.header.internalText)
      });
    });

    it('should provide the correct values in the form controls', async () => {
      expect(component.textsFormGroup.controls['internalText'].value).toEqual(component.object.header.internalText);
      expect(component.textsFormGroup.controls['invoiceText'].value).toEqual(component.object.header.invoiceText);
    });
  });
});
