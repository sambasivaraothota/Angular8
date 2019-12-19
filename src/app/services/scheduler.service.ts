import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  constructor(private httpClient: HttpClient) { }

  schedule_searchCriteriaSch(schedulingData){
   //   console.log(schedulingData)
     return this.httpClient.post(environment.schedule_savedSearchCriteria_URL, schedulingData).pipe(map(res => {
        return res ;
     }))
  }

  getSearch_criteriaSch_byID(searchID){
     return  this.httpClient.get( environment.getID_savedSearchCriteria_URL  + '/'+ searchID).pipe(map(res => {
         return res ;
     }))
  }

  update_searchCriteriaSch(reqbody,searchID){
     return this.httpClient.put(environment.update_savedSearchCriteria_URL + '/' + searchID, reqbody).pipe(map((res:any) => {
        return res ;
     }))
  }

  run_searchCriteria(){
     return  this.httpClient.get( environment.run_savedSearchCriteriaJob_URL)
  }

  getUserEmails(emailBody){
   //   console.log(emailBody)
     return this.httpClient.post(environment.getUserEmails_URL, emailBody).pipe(map(res => {
        return res ;
     }))
  }

  getUserInfo(){
     return this.httpClient.get(environment.getUserInfo_URL).pipe(map(res => { 
      return res ;
     }))
  }
}
