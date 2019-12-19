import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingPageComponent } from './scheduling-page.component';

describe('SchedulingPageComponent', () => {
  let component: SchedulingPageComponent;
  let fixture: ComponentFixture<SchedulingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
