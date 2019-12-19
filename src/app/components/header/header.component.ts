import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsolidationService } from 'src/app/services/consolidation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  expand_open: boolean = false;
  i3plHomeUrl: string = '';
  cons_tab: boolean = false;
  rates_tab: boolean = false;
  trans_tab: boolean = false;
  def_tab: boolean = false;
  review_tab: boolean = false;
  billing_tab: boolean = false;
  rules_tab: boolean = false;
  leasedBillingUrl :any;
  rulesUrl:any;
  reviewUrl: any;
  deferralUrl : any;
  transactionUrl : any;
  ratesUrl : any;
  userMenu: any = [];

  constructor(private router: Router,
              private consService : ConsolidationService) { }

  ngOnInit() {
    this.userMenu = JSON.parse(localStorage.getItem('UserMenu'));
    if (this.userMenu.find(item => item.id === 'BL_CONS')) {
      if (this.userMenu.find(item => item.id === 'BL_CONS').isVisible) {
        this.cons_tab = true;
      }
    }
    if (this.userMenu.find(item => item.id === 'BL_RATES')) {
      if (this.userMenu.find(item => item.id === 'BL_RATES').isVisible) {
        this.rates_tab = true;
        this.ratesUrl = environment.rates_URL;
      }
    }
    if (this.userMenu.find(item => item.id === 'BL_MGMT')) {
      if (this.userMenu.find(item => item.id === 'BL_MGMT').isVisible) {
        this.trans_tab = true;
        this.transactionUrl = environment.transaction_URL;
      }
    }
    if (this.userMenu.find(item => item.id === 'BL_DEFERRAL')) {
      if (this.userMenu.find(item => item.id === 'BL_DEFERRAL').isVisible) {
        this.def_tab = true;
        this.deferralUrl = environment.deferralApp_URL;
      }
    }
    if (this.userMenu.find(item => item.id === 'BL_DEFR')) {
      if (this.userMenu.find(item => item.id === 'BL_DEFR').isVisible) {
        this.def_tab = true;
        this.deferralUrl = environment.deferralApp_URL;
      }
    }
    if (this.userMenu.find(item => item.id === 'BL_RVW')) {
      if (this.userMenu.find(item => item.id === 'BL_RVW').isVisible) {
        this.review_tab = true;
        this.reviewUrl = environment.review_URL;
      }
    }
    if (this.userMenu.find(item => item.id === 'BL_LEASED')) {
      if (this.userMenu.find(item => item.id === 'BL_LEASED').isVisible) {
        this.billing_tab = true;
        this.leasedBillingUrl = environment.leasedBilling_URL;
      }
    }
    if (this.userMenu.find(item => item.id === 'BL_RULES_L')) {
      if (this.userMenu.find(item => item.id === 'BL_RULES_L').isVisible) {
        this.rules_tab = true;
        this.rulesUrl = environment.rules_URL;
      }
    }
    this.i3plHomeUrl = environment.i3pl_loginpage;
  }

  openConsolidation(){
    this.cons_tab = true;
    this.router.navigate(['/consolidate']);
  }

  openRates(){
    this.rates_tab = true;
    this.cons_tab = false;
    this.trans_tab = false;
    this.def_tab = false;
    this.review_tab = false;
    this.billing_tab = false;
    this.rules_tab = false;
  }

  openTransactions(){
    this.trans_tab = true;
    this.rates_tab = false;
    this.cons_tab = false;
    this.def_tab = false;
    this.review_tab = false;
    this.billing_tab = false;
    this.rules_tab = false;
  }

  openDeferral(){
    this.def_tab = true;
    this.trans_tab = false;
    this.rates_tab = false;
    this.cons_tab = false;
    this.review_tab = false;
    this.billing_tab = false;
    this.rules_tab = false;
  }

  openReview(){
    this.review_tab = true;
    this.def_tab = false;
    this.trans_tab = false;
    this.rates_tab = false;
    this.cons_tab = false;
    this.billing_tab = false;
    this.rules_tab = false;
  }

  openBilling(){
    this.billing_tab = true;
    this.rules_tab = false;
    this.review_tab = false;
    this.def_tab = false;
    this.trans_tab = false;
    this.rates_tab = false;
    this.cons_tab = false;
  }

  openRules(){
    this.rules_tab = true;
    this.billing_tab = false;
    this.review_tab = false;
    this.def_tab = false;
    this.trans_tab = false;
    this.rates_tab = false;
    this.cons_tab = false;
  }

  toggle() {
    this.consService.toggleSearch(true)
  }
}
