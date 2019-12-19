import { Observable, pipe } from 'rxjs'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  cookieValue = 'UNKNOWN';
  tokenValue = '';

  constructor(private cookieService: CookieService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('facilityData')) {
      if (this.cookieService.get(environment.i3pl_Cookie)) {
        this.cookieValue = this.cookieService.get(environment.i3pl_Cookie);
      }
      request = request.clone({
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          //'token': environment.i3pl_Cookie + '=' + this.cookieValue
           'token' :  this.tokenValue
        })
      });
      return next.handle(request);
    } else if (request.url.includes('customerData')) {
      if (this.cookieService.get(environment.i3pl_Cookie)) {
        this.cookieValue = this.cookieService.get(environment.i3pl_Cookie);
      }
      request = request.clone({
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          //'token': environment.i3pl_Cookie + '=' + this.cookieValue
          'token' :  this.tokenValue

        })
      });
      return next.handle(request);
    } else if (request.url.includes('inventoryTransaction')) {
      if (this.cookieService.get(environment.i3pl_Cookie)) {
        this.cookieValue = this.cookieService.get(environment.i3pl_Cookie);
      }
      request = request.clone({
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'token': environment.i3pl_Cookie + '=' + this.cookieValue
          'token' :  this.tokenValue
        })
      });
      return next.handle(request);
    } else if (request.url.includes('CurrentUser/Menu')) {
      if (this.cookieService.get(environment.i3pl_Cookie)) {
        this.cookieValue = this.cookieService.get(environment.i3pl_Cookie);
      }
      request = request.clone({
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'cookie': environment.i3pl_Cookie + '=' + this.cookieValue
          'cookie' :  this.tokenValue
        })
      });
      return next.handle(request);
    } else if (request.url.includes('userinfo')) {
      if (this.cookieService.get(environment.i3pl_Cookie)) {
        this.cookieValue = this.cookieService.get(environment.i3pl_Cookie);
      }
      request = request.clone({
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          //  'token': environment.i3pl_Cookie + '=' + this.cookieValue
         'token' :  this.tokenValue
        })
      });
      return next.handle(request);
    } else if (request.url.includes('usermenu')) {
      if (this.cookieService.get(environment.i3pl_Cookie)) {
        this.cookieValue = this.cookieService.get(environment.i3pl_Cookie);
      }
      request = request.clone({
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
         //  'token': environment.i3pl_Cookie + '=' + this.cookieValue
          'token' :  this.tokenValue
        })
      });
      return next.handle(request);
    } else if (request.url.includes('GetUserEmails')) {
      if (this.cookieService.get(environment.i3pl_Cookie)) {
        this.cookieValue = this.cookieService.get(environment.i3pl_Cookie);
      }
      request = request.clone({
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'token': environment.i3pl_Cookie + '=' + this.cookieValue
          'token' :  this.tokenValue
        })
      });
      return next.handle(request);
    } else if (request.url.includes('FileExport')) {
      return next.handle(request);
    } else if (request.url.includes('savedSearchView')) {
      return next.handle(request);
    } else {
      request = request.clone({
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      })
    };
    return next.handle(request);
  }
}
