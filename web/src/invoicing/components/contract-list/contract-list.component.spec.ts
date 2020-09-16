import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {ContractListComponent} from './contract-list.component';
import {mockAllContracts} from '../../../test/factories/mock-contracts.factory';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {ContractFactory} from 'jovisco-domain';

describe('Contract List Component', () => {

  let component: ContractListComponent;
  let fixture: ComponentFixture<ContractListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [ContractListComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.objects = mockAllContracts().map(c => ContractFactory.fromData(c));
      component.ngOnChanges();
    });

    it('should provide the contracts in the data source for the table', async () => {
      expect(component.objects.length).toBeGreaterThan(0);
      expect(component.dataSource.data).toHaveLength(component.objects.length);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.objects = mockAllContracts().slice(0, 5).map(c => ContractFactory.fromData(c));
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should show a table with header line and 4 lines with users', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('mat-table'));
      await expect(de).toBeTruthy();
      const count = de.children.length;
      await expect(count).toBe(6);
      de = fixture.debugElement.query(By.css('mat-table mat-header-row'));
      await expect(de).toBeTruthy();
    });

    it('should navigate to contract details when contract id link button is pressed', async () => {
      const href = fixture.debugElement.query(By.css('a')).nativeElement.getAttribute('href');
      return expect(href).toEqual(`/invoicing/contracts/${component.objects[0].header.id}`);
    });

  });
});


