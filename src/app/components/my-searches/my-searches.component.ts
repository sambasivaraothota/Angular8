import { Component, OnInit } from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SchedulingPageComponent } from '../scheduling-page/scheduling-page.component';
import { SchedulerService } from 'src/app/services/scheduler.service';
import { ConsolidationService } from '../../services/consolidation.service';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { NgxSpinnerService } from "ngx-spinner";
import { MessagePopupComponent } from '../message-popup/message-popup.component';

@Component({
  selector: 'app-my-searches',
  templateUrl: './my-searches.component.html',
  styleUrls: ['./my-searches.component.css']
})

export class MySearchesComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['QUICK ACTIONS','NAME', 'SCHEDULE', 'LAST MODIFIED'];
  selected_pageRange="10";
  count;
  pages = []
  currentPage = 1;
  pageNumLimit = 10;
  pageNumbers = [];
  d;
  pagecount = 0;
  page_from = 0;
  page_to = this.selected_pageRange;
  scheduled = false;
  id;
  userId = localStorage.getItem("userId");
  scheduled_data: any;
  delete_text: any;
  show_pagination: boolean;
  no_data = false

  constructor(public dialog: MatDialog,
              private schedulerservice: SchedulerService,
              private consolidateService: ConsolidationService,
              private ngxSpinner: NgxSpinnerService) {
        this.d = this.chunk(this.pages, 5)
        this.pageNumbers = this.d[this.pagecount]
  }

  ngOnInit() {
     this.activePage(1);
     this.onLoad_searches(true)
  }

  onLoad_searches(initial?) {
    if(initial) {
      this.currentPage = 1;
      this.pagecount = 0
    }
    this.getAllSchedularsch(this.currentPage , this.selected_pageRange);
  }

  openScheduler(data,isEdit?){
      if(isEdit) {
      data = {
        ID : data.ID,
        NAME:data.NAME,
        isEdit : isEdit ? true : false
      }
    }
    const dialogRef = this.dialog.open(SchedulingPageComponent, {
      disableClose: true,
      height:'600px',
      width: '550px',
      autoFocus: false ,
      data: data
    },);
    dialogRef.afterClosed().subscribe(result => {
      this.getAllSchedularsch(this.currentPage , this.selected_pageRange);
    })
  }

  chunk(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
      const last = chunked_arr[chunked_arr.length - 1];
      if (!last || last.length === size) {
        chunked_arr.push([array[i]]);
      } else {
        last.push(array[i]);
      }
    }
    return chunked_arr;
  }

  forward(p) {
    if (this.pageNumbers.findIndex(x => x === p) === 4) {
      this.pagecount += 1;
      this.pageNumbers = this.d[this.pagecount]
      this.currentPage = this.pageNumbers[0];  
    } else {
      this.currentPage = p + 1;    
    }
    this.onLoad_searches(false);
  }

  backward(p) {
    if (this.pageNumbers.findIndex(x => x === p) === 0) {
      this.pagecount -= 1;
      this.pageNumbers = this.d[this.pagecount]
      this.currentPage = this.pageNumbers[4]; 
    } else {
      this.currentPage = p - 1;
    }
    this.onLoad_searches(false)
  }

  activePage(p) {
    this.currentPage = p;
    this.onLoad_searches(false);
  }

  first() {
    this.pagecount = 0;
    this.pageNumbers = this.d[0]
    this.currentPage = this.pageNumbers[0]
    this.onLoad_searches(false);
  }

  last() {
    this.pagecount = this.d.length - 1;
    //console.log(this.d.length)
    this.pageNumbers = this.d[this.d.length - 1]
    this.currentPage = this.pageNumbers[this.pageNumbers.length - 1]
    this.onLoad_searches(false)
  }

  tablePageChange(event) {
    this.selected_pageRange= event
    // console.log(this.selected_pageRange)
    this.onLoad_searches(true)
  }

  getAllSchedularsch(page_from,page_size){
    // let  page_from = 1
    // let page_size = 1000
    //this.userId = localStorage.getItem("userId");
    this.ngxSpinner.show();
    this.consolidateService.saveSearchCriteriaView(this.userId, page_from, page_size, 'undefined').subscribe((res: any) => {
      if (res !== undefined && res !== '' && res.statusCode === "200") {
        this.ngxSpinner.hide();
        if (res.savedData && res.savedData.length > 0) {
         this.dataSource = new MatTableDataSource(res.savedData);
         this.count = res['count']

         if(this.count){
           this.show_pagination = true
         }else{
           this.show_pagination = false
         }

         this.pages = []
         this.pageNumbers = []
         let showingPages = 0;
         if(this.count % parseFloat(this.selected_pageRange) !== 0) {
           showingPages = (this.count - this.count % parseFloat(this.selected_pageRange)) / parseFloat(this.selected_pageRange) + 1
         } else {
           showingPages = this.count/ parseFloat(this.selected_pageRange)
         }
        
         for (let i = 1; i <= showingPages; i++) {
           this.pages.push(i);
         }
         this.d = this.chunk(this.pages, 3)
         this.pageNumbers = this.d[this.pagecount]
        }else{
          this.dataSource = new MatTableDataSource([]);
            this.no_data = true;
            this.show_pagination = false;
            this.count= 0
        }
      }
    }, err => {
        this.ngxSpinner.hide();
    })
  }

  applyFilter(filterValue: string) {
    let searchName = filterValue;
    if (searchName === '' || searchName === null)
      searchName = 'undefined';

    this.ngxSpinner.show();
    this.consolidateService.saveSearchCriteriaView(this.userId, 1, 100, searchName).subscribe((res: any) => {
      if (res !== undefined && res !== '' && res.statusCode === "200") {
        this.ngxSpinner.hide();
        if (res.savedData && res.savedData.length > 0) {
          this.dataSource = new MatTableDataSource(res.savedData);
          this.count = res['count']
          
          if(this.count){
            this.show_pagination = true
          }else{
            this.show_pagination = false
          }

          this.pages = []
          this.pageNumbers = []
          let showingPages = 0;
          if(this.count % parseFloat(this.selected_pageRange) !== 0) {
            showingPages = (this.count - this.count % parseFloat(this.selected_pageRange))/ parseFloat(this.selected_pageRange) + 1
          } else {
            showingPages = this.count/parseFloat(this.selected_pageRange)
          }
          
          for (let i = 1; i <= showingPages; i++) {
            this.pages.push(i);
          }
          this.d = this.chunk(this.pages, 3)
          this.pageNumbers = this.d[this.pagecount]
        }
      }
    }, err => {
      this.ngxSpinner.hide();
    })
  }

  editReport(edit_data){
    this.openScheduler(edit_data,true)
  }

  deleteReport(del_id){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      disableClose: true,
      // height:'145px',
      width: '25em',
      autoFocus: false ,
    },);

    dialogRef.afterClosed().subscribe(result => {
      this.delete_text = result;
      
      if(this.delete_text === 'true'){
        let del_body ={
          "LastUpdatedBy":this.userId,
          "User_savedSearch": this.userId
        }
        
        this.consolidateService.deleteSearchCriteria(del_body,del_id).subscribe( res =>{
          if(res){
            this.getAllSchedularsch(this.currentPage , this.selected_pageRange);
            this.dialog.open(MessagePopupComponent, {
              disableClose: true,
              //height: '250px',
              width: '450px',
              autoFocus: false,
              data: "Search criteria deleted successfully"
            });
          }
         },err=>{
           this.ngxSpinner.hide();
         })
      }
    })
  }

  lockReport(sch_id){
  }
}
