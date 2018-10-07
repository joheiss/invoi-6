import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../shared/material.module';
import {Store} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import {Logout} from '../store/actions';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {GoodbyeComponent} from './goodbye.component';

describe('GoodbyeComponent', () => {
  let component: GoodbyeComponent;
  let fixture: ComponentFixture<GoodbyeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule],
      declarations: [GoodbyeComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodbyeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    return expect(component).toBeTruthy();
  });


  describe('ngOnInit()', () => {
    it('should dispatch the Logout action in ngOnInit lifecycle event', () => {
      const action = new Logout();
      const store = TestBed.get(Store);
      const spy = jest.spyOn(store, 'dispatch');
      fixture.detectChanges();
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });
});

