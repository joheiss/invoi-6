import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HomeComponent} from './home.component';

describe('HomeComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.debugElement.componentInstance;
    return expect(component).toBeTruthy();
  }));
});
