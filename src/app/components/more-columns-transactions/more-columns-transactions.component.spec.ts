import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreColumnsTransactionsComponent } from './more-columns-transactions.component';

describe('MoreColumnsTransactionsComponent', () => {
  let component: MoreColumnsTransactionsComponent;
  let fixture: ComponentFixture<MoreColumnsTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreColumnsTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreColumnsTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
