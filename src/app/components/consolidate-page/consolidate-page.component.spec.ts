import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatePageComponent } from './consolidate-page.component';

describe('ConsolidatePageComponent', () => {
  let component: ConsolidatePageComponent;
  let fixture: ComponentFixture<ConsolidatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
