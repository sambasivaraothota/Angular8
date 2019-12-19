import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSearchInfoComponent } from './saved-search-info.component';

describe('SavedSearchInfoComponent', () => {
  let component: SavedSearchInfoComponent;
  let fixture: ComponentFixture<SavedSearchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedSearchInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedSearchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
