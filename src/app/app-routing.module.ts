import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ConsolidatePageComponent } from './components/consolidate-page/consolidate-page.component';
import { MySearchesComponent } from './components/my-searches/my-searches.component';

const routes: Routes = [
  { path: '',redirectTo: '/consolidate',pathMatch: 'full'},
  { path: 'consolidate', component: ConsolidatePageComponent },
  { path: 'mySearches', component: MySearchesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
