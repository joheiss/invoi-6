import {CardAvatarComponent} from '..';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {mockContractSummary} from '../../../test/factories/mock-contracts.factory';
import {By} from '@angular/platform-browser';

describe('Card Avatar Component', () => {

  let component: CardAvatarComponent;
  let fixture: ComponentFixture<CardAvatarComponent>;

  beforeEach(async () => {
    return TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MaterialModule, FlexLayoutModule],
      declarations: [CardAvatarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('View', () => {

    describe('When component is initially displayed', () => {

      beforeEach(() => {
        component.object = mockContractSummary().object;
        fixture.detectChanges();
      });

      it('should show the correct id and color in id avatar', async () => {
        const div = fixture.debugElement.query(By.css('div.jo-id-avatar--active')).nativeElement as HTMLDivElement;
        return expect(div.lastChild.textContent).toContain(component.object.header.id);
      });
    });
  });
});
