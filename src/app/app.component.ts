import { Component, OnInit } from '@angular/core';
import { ConsolidationService } from './services/consolidation.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Inventory-Consolidation-UI';
  showNav = false;
  userName: string = '';
  masterAccountName: string = '';
  user_name;
  mySearchesVisible: boolean = true;
  

  constructor(private consService : ConsolidationService,
              private router: Router,
              private cookieService: CookieService) {
  }

  sideNavClose() {
    if(!this.consService.toggleSidenavControl) {
      if(this.showNav) this.showNav = false
    }
    this.consService.toggleSidenavControl = false
  }

  openMySearches(){
    this.router.navigate(['/mySearches']);
    this.sideNavClose()
  }

  ngOnInit() {
    //For Local development testing, uncomment the below line and update the latest cookie value
    //this.cookieService.set('.i3plAuthent-Test', 'COOKIEVALUE');
    // if (this.cookieService.check(environment.i3pl_Cookie)) {
    //   this.consService.getCurrentUser().subscribe((res : any) => {
    //     //console.log("Res : ", res);
    //     if(res.userInfo.userID) {
    //       localStorage.setItem("userId", res.userInfo.userID);
    //     }
    //     if(res.userInfo.userName) {
    //       localStorage.setItem("userName", res.userInfo.userName);
    //       this.userName = localStorage.getItem('userName');
    //     }
    //     if(res.userInfo.masterAccount) {
    //       localStorage.setItem("masterAccountName", res.userInfo.masterAccount.name);
    //       this.masterAccountName = localStorage.getItem('masterAccountName');
    //     }
    //   }, err => {
    //     console.log("Unable to get the UserInfo: ", err);
    //   })

    //   this.consService.getUserMenu().subscribe((res : any) => {
    //     if(res.userMenu) {
    //       localStorage.setItem("UserMenu", JSON.stringify(res.userMenu));
    //       if (res.userMenu.find(item => item.id === 'BL_SAVE')) {
    //         if (res.userMenu.find(item => item.id === 'BL_SAVE').isVisible) {
    //           this.mySearchesVisible = true;
    //         }
    //       }
    //     }
    //   }, err => {
    //     console.log("Unable to get the UserMenu: ", err);
    //   });

      this.consService.toggleSidenav.subscribe(data => {
        this.showNav = !this.showNav
      });
    // } else {
    //   window.location.href = environment.i3pl_loginpage + '/login?ReturnUrl=%2f#/';
    // }
  }

  private logout() {
    this.cookieService.delete(environment.i3pl_Cookie);
    window.location.href = environment.i3pl_loginpage + '/home/logout';
  }
}
