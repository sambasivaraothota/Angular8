import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  americold_page :any;
  companyInfo: any;
  edi_Link: any;
  userAgmtLink: any;

  constructor() { }

  ngOnInit() {
    this.americold_page = environment.americold_page;
    this.companyInfo = environment.company_info;
    this.edi_Link = environment.EDI_URL;
    this.userAgmtLink = environment.user_Agreement;
  }

}
