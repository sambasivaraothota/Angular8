import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule, } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { ConsolidatePageComponent } from '../consolidate-page/consolidate-page.component';
import { MatListModule, MatCardModule, MatCheckboxModule, MatFormFieldModule,MatButtonModule, MatDatepickerModule,MatTableModule,MatIconModule,
  MatNativeDateModule,MatInputModule,MatSelectModule,MatDialogModule,} from '@angular/material';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  

const routes: Routes = [
  { path: '',redirectTo: '/consolidate',pathMatch: 'full'},
  {  path: 'consolidate', component: ConsolidatePageComponent }
];

fdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent,ConsolidatePageComponent ],
      imports: [ FlexLayoutModule,AppRoutingModule, RouterModule.forRoot(routes),
        MatListModule, MatCardModule, MatCheckboxModule, MatFormFieldModule,MatButtonModule, MatDatepickerModule,MatTableModule,MatIconModule,
        MatNativeDateModule,MatInputModule,MatSelectModule,MatDialogModule,FormsModule, ReactiveFormsModule,
      ],
    
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tab value to selected',async(() => {
    component.tab;
      expect(component.tab).toEqual('selected')
  }));

  it('unit testing for openConsolidation', () => {
    spyOn(component, 'openConsolidation');
    component.openConsolidation();
    expect(component.openConsolidation).toHaveBeenCalled();
  });

});
