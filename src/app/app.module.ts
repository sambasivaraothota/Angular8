import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './Security/ICC_interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConsolidationService } from 'src/app/services/consolidation.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule, MatCardModule, MatCheckboxModule, MatFormFieldModule,MatButtonModule, MatDatepickerModule,MatTableModule,MatIconModule,
  MatTooltipModule, MatSidenavModule,MatNativeDateModule,MatInputModule,MatSelectModule,MatDialogModule,MatButtonToggleModule,
  MatMenuModule, MatSortModule, MatAutocompleteModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ConsolidatePageComponent } from './components/consolidate-page/consolidate-page.component';
import { AddColumnsComponent } from './components/add-columns/add-columns.component';
import { SidebarModule } from 'ng-sidebar';
import { TransactionsPageComponent } from './components/transactions-page/transactions-page.component';
import { clickOutsidetDirective } from './Directives/click-outside.directive';
import { MoreColumnsTransactionsComponent } from './components/more-columns-transactions/more-columns-transactions.component';
import { MySearchesComponent } from './components/my-searches/my-searches.component';
import { SchedulingPageComponent } from './components/scheduling-page/scheduling-page.component';
import { MessagePopupComponent } from './components/message-popup/message-popup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';
import { DatePipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SavedSearchInfoComponent } from './components/saved-search-info/saved-search-info.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    ConsolidatePageComponent,
    AddColumnsComponent,
    TransactionsPageComponent,
    clickOutsidetDirective,
    MoreColumnsTransactionsComponent,
    MySearchesComponent,
    SchedulingPageComponent,
    DeletePopupComponent,
    MessagePopupComponent,
    SavedSearchInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SidebarModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    Ng2SmartTableModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatListModule,MatSidenavModule,MatCardModule, MatMenuModule,
    MatCheckboxModule,MatButtonToggleModule,MatTooltipModule,MatAutocompleteModule,
    MatButtonModule,MatInputModule, MatFormFieldModule,MatTableModule,MatIconModule,
    MatSelectModule,MatDatepickerModule,MatNativeDateModule,MatDialogModule,MatSortModule,
    NgxSpinnerModule,
    MatProgressSpinnerModule
  ],
  exports:[],
  providers: [
    ConsolidationService,
    MatDatepickerModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    CookieService,
    DatePipe
  ],
  entryComponents: [AddColumnsComponent,MoreColumnsTransactionsComponent,SchedulingPageComponent,DeletePopupComponent,MessagePopupComponent,SavedSearchInfoComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
