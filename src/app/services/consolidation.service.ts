import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsolidationService {

  consolidationColums:any;
  transactionData:any;
  toggleSidenav = new Subject();
  toggleSidenavControl = false;
  userInfo: any;

  constructor(private httpClient: HttpClient) {
  }

  // Get UserInfo
  getCurrentUser(){
    return this.httpClient.get(environment.i3pl_UserInfo)
  }

  // Get UserMenu
  getUserMenu(){
    return this.httpClient.get(environment.i3pl_UserMenu)
  }

  // getting consolidation column names from external json file that to be shown in the table
  getConsolidation_columns(){
    this.consolidationColums = this.httpClient.get("/assets/consolidation-columns.json")
    return this.consolidationColums;
  }

  getTransaction_columns(){
    this.transactionData = this.httpClient.get("/assets/transaction-columns.json")
    return this.transactionData;
  }

  //open toggle when click on user icon
  toggleSearch(data) {
    this.toggleSidenav.next(data)
    this.toggleSidenavControl = true
  }

  //Consolidation search api
  getConsolidationTable_data(reqBody, page_from, page_to, sortField, sortDir, searchTerm) {
    //console.log(searchTerm);
    if (searchTerm == 'undefined' || searchTerm == undefined) {
      return this.httpClient.post(environment.consolidationTable_URL + '?from=' + page_from + '&size=' + page_to +
        '&sortField=' + sortField + '&sortDir=' + sortDir, reqBody).pipe(map(res => {
        return res ;
      }))
    } else {
      return this.httpClient.post(environment.consolidationTable_URL + '?from=' + page_from + '&size=' + page_to  +
        '&sortField=' + sortField + '&sortDir=' + sortDir + '&searchTerm=' +searchTerm, reqBody).pipe(map(res => {
        return res ;
      }))
    }
  }

  //FileExport Api
  fileExport(reqBody, page_from, page_to, searchTerm) {
    const httpOption: Object = {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'arraybuffer'
    };

    if (!searchTerm){
      console.log("Search Term : ", searchTerm);
      return this.httpClient.post(environment.fileExport_URL + '?from=' + page_from + '&size=' + page_to, reqBody,
        httpOption).pipe(map((res: HttpResponse<any>) => {
        console.log("Res Header : ", res.headers.get('content-type'));
        if (res.headers && res.headers.get('content-type') === 'application/zip') {
          return {
            filename: 'InventoryConsolidated.zip',
            data: new Blob(
              [res['body']],
              { type: 'application/zip'}
            ),
          };
        } else if (res.headers && res.headers.get('content-type') === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          return {
            filename: 'InventoryConsolidated.xlsx',
            data: new Blob(
              [res['body']],
              {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
            ),
          };
        } else {
          return {
            filename: 'InventoryConsolidated.xlsx',
            data: new Blob(
              [res['body']],
              {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
            ),
          };
        }
      }))
    } else {
      console.log("Search Term : ", searchTerm);
      return this.httpClient.post(environment.fileExport_URL + '?from=' + page_from + '&size=' + page_to + '&searchTerm=' + searchTerm, reqBody,
        httpOption).pipe(map((res: HttpResponse<any>) => {
        console.log("Res Header : ", res.headers.get('content-type'));
        if (res.headers && res.headers.get('content-type') === 'application/zip') {
          return {
            filename: 'InventoryConsolidated.zip',
            data: new Blob(
              [res['body']],
              { type: 'application/zip'}
            ),
          };
        } else if (res.headers && res.headers.get('content-type') === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          return {
            filename: 'InventoryConsolidated.xlsx',
            data: new Blob(
              [res['body']],
              {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
            ),
          };
        } else {
          return {
            filename: 'InventoryConsolidated.xlsx',
            data: new Blob(
              [res['body']],
              {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
            ),
          };
        }
      }))
    }
  }

  getTransactionTable_data(reqBody){
    //console.log(reqBody)
    return this.httpClient.post(environment.transactionTable_URL,reqBody).pipe(map(res => {
      return res;
    }))
  }

  getFacility(facility_search){
    //console.log(facility_search);
    return  this.httpClient.get( environment.facility_URL + '?id=' + facility_search)
  }

  getCustomer(facilityData){
    return this.httpClient.get( environment.customer_URL + '?facility=' + facilityData.facility_key + '&id=' +
      facilityData.customer_search + '&source=' + facilityData.source)
  }

  //Save API for SearchCriteria
  saveSearchCriteria(reqBody) {
    return this.httpClient.post(environment.savedSearch_URL, reqBody).pipe(map(res => {
      return res;
    }))
  }

  //Get the list of Saved SearchCriteria's based on the user
  saveSearchCriteriaView(userId, page_from, page_size, searchName) {
    const saveSearchView: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'user_saved_search': userId
      })
    };
    if (searchName !== 'undefined') {
      return this.httpClient.get(environment.savedSearchView_URL + "?_page=" + page_from + "&_limit=" + page_size +
        "&searchName=" +searchName, saveSearchView).pipe(map(res => {
        return res;
      }));
    } else {
      return this.httpClient.get(environment.savedSearchView_URL + "?_page=" + page_from + "&_limit=" + page_size,
        saveSearchView).pipe(map(res => {
        return res;
      }));
    }
  }

  //Apply Saved SearchCriteria
  applySearchCriteria(searchCriteriaId) {
    return this.httpClient.get(environment.applySearchCriteria_URL + "?Id=" +searchCriteriaId).pipe(map(res => {
      return res;
    }));
  }

  //Delete Saved SearchCriteria deleteSearchCriteria_URL
  deleteSearchCriteria(searchCriteria_data, searchCriteriaId) {
    console.log("Search criteria Id for Delete : ", searchCriteriaId);
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body : searchCriteria_data
    };
    return this.httpClient.delete(environment.deleteSearchCriteria_URL + "/" + searchCriteriaId , options).
    pipe(map(res => {
      return res;
    }));
  }
}
