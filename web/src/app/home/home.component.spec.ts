import { TestBed, waitForAsync } from '@angular/core/testing';
import {HomeComponent} from './home.component';

describe('HomeComponent', () => {

  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      declarations: [HomeComponent]
    }).compileComponents();
  }));

  it('should create the component', waitForAsync(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.debugElement.componentInstance;
    return expect(component).toBeTruthy();
  }));
});
