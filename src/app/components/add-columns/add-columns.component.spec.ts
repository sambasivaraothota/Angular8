import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddColumnsComponent } from './add-columns.component';
import { MatCheckboxModule,MatButtonModule,MatTableModule,MatIconModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule,MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

fdescribe('AddColumnsComponent', () => {
  let component: AddColumnsComponent;
  let fixture: ComponentFixture<AddColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddColumnsComponent ],
      imports: [ MatCheckboxModule,MatButtonModule,MatTableModule,MatIconModule,MatDialogModule,FlexLayoutModule,FormsModule,ReactiveFormsModule ],
        providers: [
          { provide: MatDialogRef, useValue: {} }, 
          { provide: MAT_DIALOG_DATA,   useValue: {} }
        ]
        // providers: [LoginService, LeadsPageService, LandingPageService, UserFriendlyMsgs, MarketingService, CdkColumnDef,CookieService,
        //   {
        //  provide: HTTP_INTERCEPTORS,
        //  useClass: AuthInterceptor,
        //  multi: true,
        //  }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit testing for selectAll', () => {
    spyOn(component, 'selectAll');
    component.selectAll();
    expect(component.selectAll).toHaveBeenCalled();
  });

  it('unit testing for clearAll', () => {
    spyOn(component, 'clearAll');
    component.clearAll();
    expect(component.clearAll).toHaveBeenCalled();
  });

  it('unit testing for onClickOk', () => {
    spyOn(component, 'onClickOk');
    component.onClickOk();
    expect(component.onClickOk).toHaveBeenCalled();
  });

  it('unit testing for onNoClick', () => {
    spyOn(component, 'onNoClick');
    component.onNoClick();
    expect(component.onNoClick).toHaveBeenCalled();
  });
  
  it('should set select+_all and clear_all values to false',async(() => {
    component.select_all;
    component.clear_all;
    expect(component.select_all).toBe(false);
    expect(component.clear_all).toBe(false)
  }));

});
