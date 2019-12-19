import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SchedulerService } from 'src/app/services/scheduler.service';
import { MessagePopupComponent } from '../message-popup/message-popup.component';

@Component({
  selector: 'app-scheduling-page',
  templateUrl: './scheduling-page.component.html',
  styleUrls: ['./scheduling-page.component.css']
})
export class SchedulingPageComponent implements OnInit {

  Types = [ 'Daily', 'Weekly', 'Monthly'];
  //Formats = [ 'Excel', 'PDF','CSV' ];
  Formats = [ 'Excel'];
  Destinations = [ 'Email' ];
  SchedulingForm:FormGroup;
  checked_day :boolean = true;
  checked_month :boolean = true;
  selectedMonthly=false;
  selectedWeekly = false;
  selectedDaily = true;
  allDays=['Monday','Tuesday','Wednesday','Thursday','Friday'];
  checked_color = true;
  Week_Days = [
    {
      name: 'Weekday',
      Days: [
        {value: 'Monday', viewDay: 'Monday'},
        {value: 'Tuesday', viewDay: 'Tuesday'},
        {value: 'Wednesday', viewDay: 'Wednesday'},
        {value: 'Thursday', viewDay: 'Thursday'},
        {value: 'Friday', viewDay: 'Friday'}
      ]
    },
    {
      name: 'Weekend',
      Days: [
        {value: 'Saturday', viewDay: 'Saturday'},
        {value: 'Sunday', viewDay: 'Sunday'},
      ]
    },
  ]

  Months=[
    {
      name: 'Select / Clear',
      Month_names: [
        {value: 'January', viewMonth: 'January'},
        {value: 'February', viewMonth: 'February'},
        {value: 'March', viewMonth: 'March'},
        {value: 'April', viewMonth: 'April'},
        {value: 'May', viewMonth: 'May'},
        {value: 'June', viewMonth: 'June'},
        {value: 'July', viewMonth: 'July'},
        {value: 'August', viewMonth: 'August'},
        {value: 'September', viewMonth: 'September'},
        {value: 'October', viewMonth: 'October'},
        {value: 'November', viewMonth: 'November'},
        {value: 'December', viewMonth: 'December'}
      ]
    }
  ]
  search_criteriaID : any;
  search_criteriaName: any;
  scheduled : boolean;
  users_emails = []
  search_id: any;
  is_edit: any;
  selectedEmails: any[] = new Array<string>();
  userId = localStorage.getItem("userId");

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<SchedulingPageComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
              private schedulerservice:SchedulerService) {
    dialogRef.disableClose = true;
    this.SchedulingForm = new FormGroup({
      start_date : new FormControl(new Date()),
      schedule_type : new FormControl('Daily'),
      format_type : new FormControl('Excel'),
      destination_type :  new FormControl('Email'),
      days : new FormControl(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']),
      months : new FormControl(['January','February','March','April','May','June','July','August','September','October','November','December']),
      calendar_days : new FormControl(''),
      // repeat_days : new FormControl(''),
      // repeat_weeks : new FormControl(''),
      selected_email : new FormControl('',[Validators.required])
    })
}

  ngOnInit() {
    this.search_criteriaID = this.data.ID;
    this.search_criteriaName = this.data.NAME;
    this.is_edit = this.data.isEdit
    if(this.data.isEdit) {
        this.schedulerservice.getSearch_criteriaSch_byID(this.search_criteriaID).subscribe( (res:any) =>{
        //console.log(res)
        if(res){
             let sch_job = res['jsonScheduledJob']
              this.search_id = res['id']
              this.SchedulingForm.patchValue({
                start_date : res.createdTimestamp ,
                schedule_type : JSON.parse(sch_job).Sch_Type,
                format_type : res.format_Type,
                destination_type : res.destination_Type,
                days : JSON.parse(sch_job).Days_Of_Week.split(','),
                months : JSON.parse(sch_job).Selected_Month.split(','),
                calendar_days :JSON.parse(sch_job).On_Calendar_Days,
                selected_email : res.destination_Value
              });
              this.selectedEmails.push(res.destination_Value);
        }
        },err=>{
          //console.log('Error while fetching Schedular data By SearchItemId ',err)
        })
    }

  }

  optionClicked(event: Event, email) {
    event.stopPropagation();
    this.toggleSelection(email);
  }

  toggleSelection(email) {
    if (this.selectedEmails.indexOf(email) < 0) {
      this.selectedEmails.push(email);
    } else {
      const i = this.selectedEmails.findIndex(value => value === email);
      this.selectedEmails.splice(i, 1);
    }

    let displayEmails = '';

    for(var i=0;i<this.selectedEmails.length ;i++){
      displayEmails = displayEmails.length == 0  ? this.selectedEmails[i] : displayEmails + ',' + this.selectedEmails[i];
    }
    

    this.SchedulingForm.patchValue({
      selected_email: displayEmails
      });
    //this.selected_email.patchValue(this.selectedEmails);
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedType(type){

    if(type === 'Monthly'){
       this.selectedMonthly =  true;
    }else{
      this.selectedMonthly = false;
    }

    if(type === 'Weekly'){
       this.selectedWeekly = true;
       this.selectedMonthly = false;
       this.selectedDaily = false;
    }else{
      this.selectedWeekly = false;
    }

    if(type === 'Daily'){
      this.selectedDaily = true;
      this.selectedWeekly = false;
      this.selectedMonthly = false;
   }else{
     this.selectedDaily = false;
   }

  }

onSchedule(){

  if(this.SchedulingForm.value.selected_email !== undefined && this.SchedulingForm.value.selected_email !== null && this.SchedulingForm.value.selected_email !== '')
  {
    if(this.is_edit && this.search_id  !== undefined) {
                  let scheduling_Data = {
                    "id" : this.search_id,
                    "createdBy": this.userId,
                    "lastUpdatedBy": this.userId,
                    "user_Saved_Search_Id": this.search_criteriaID,
                    "destination_Type": this.SchedulingForm.value.destination_type,
                    "destination_Value": this.SchedulingForm.value.selected_email,
                    "format_Type": this.SchedulingForm.value.format_type,
                    "jsonScheduledJob": JSON.stringify({
                                  "sch_Start_Date":new Date(this.SchedulingForm.value.start_date).toISOString(),
                                  "sch_End_Date" :  null,
                                  "sch_Type": this.SchedulingForm.value.schedule_type,
                                  "days_Of_Week":  this.SchedulingForm.value.days ?  (this.SchedulingForm.value.days).join()  : '',
                                  // "repeat_EveryDay":"",
                                  // "repeat_EveryWeek":"",
                                  "selected_Month": this.SchedulingForm.value.months ? (this.SchedulingForm.value.months).join() : '',
                                  "on_Calendar_Days": this.SchedulingForm.value.calendar_days
                                })
                }
          this.schedulerservice.update_searchCriteriaSch(JSON.stringify(scheduling_Data),this.search_id).subscribe( res =>{
            this.dialogRef.close();

            this.dialog.open(MessagePopupComponent, {
                disableClose: true,
                //height: '250px',
                width: '450px',
                autoFocus: false,
                data: "Schedule details updated successfully"
            });
          },error => {
            this.dialogRef.close();
          })

         } else {

                let schedulingData = {
                  "createdBy": this.userId,
                  "user_Saved_Search_Id": this.search_criteriaID,
                  "destination_Type": this.SchedulingForm.value.destination_type,
                  "destination_Value": this.SchedulingForm.value.selected_email,
                  "format_Type": this.SchedulingForm.value.format_type,
                  "jsonScheduledJob": JSON.stringify({
                                "sch_Start_Date":new Date(this.SchedulingForm.value.start_date).toISOString(),
                                "sch_Type":this.SchedulingForm.value.schedule_type,
                                "days_Of_Week":this.SchedulingForm.value.schedule_type=== 'Weekly' ? (this.SchedulingForm.value.days).join() : '',
                                // "repeat_EveryDay":this.SchedulingForm.value.repeat_days,
                                // "repeat_EveryWeek":this.SchedulingForm.value.repeat_days,
                                "selected_Month":this.SchedulingForm.value.schedule_type=== 'Monthly' ? (this.SchedulingForm.value.months).join() : '',
                                "on_Calendar_Days":this.SchedulingForm.value.schedule_type=== 'Monthly' ? this.SchedulingForm.value.calendar_days : ''
                              })
              }
            this.schedulerservice.schedule_searchCriteriaSch(JSON.stringify(schedulingData)).subscribe((res : any) =>{
                  this.dialogRef.close();
                },error => {
                  this.dialogRef.close();
            })
         }
  }
  else
  {
    this.SchedulingForm.controls['selected_email'].setErrors({'incorrect': true});
    this.SchedulingForm.controls['selected_email'].markAsTouched();
  }
}


getUser_emails(event){
  // console.log(event.target.value)
  let emailValues = event.target.value.split(",");
  let emailValue = emailValues[emailValues.length-1];
  let emailBody = {
    "prefixText": emailValue,
    "count": 1000
  };
  this.schedulerservice.getUserEmails(JSON.stringify(emailBody)).subscribe(res =>{
  this.users_emails = res["d"];
  })
}

}
