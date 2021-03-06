import { TestBed, waitForAsync } from '@angular/core/testing';
import {AppShellComponent} from './app-shell.component';

describe('App Shell Component', () => {

  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      declarations: [AppShellComponent]
    }).compileComponents();
  }));

  it('should create the component', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));
});
