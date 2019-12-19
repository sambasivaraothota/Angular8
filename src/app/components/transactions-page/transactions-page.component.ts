import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddColumnsComponent } from '../add-columns/add-columns.component';
import { HttpClient } from '@angular/common/http';
import { ConsolidationService } from 'src/app/services/consolidation.service';
import { MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { MoreColumnsTransactionsComponent } from '../more-columns-transactions/more-columns-transactions.component';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.css']
})
export class TransactionsPageComponent implements OnInit {

  @Input() selectedData;

  dataSource =  new MatTableDataSource([]);
  displayedColumns: any[]=[];
  columnsToDisplay:any[]=[];
  tableShow:boolean;
  filteredData = []
  totalDataArray = []
  filterValue;

  count;
  pages = []
  currentPage = 1;
  pageNumLimit = 10;
  pageNumbers = [];
  d;
  selected;
  pagecount = 0;
  page_from = 0;
  page_to = this.selected;
  paginationShow =false;
  transSearchMessage: string = '';
  total_resArray : any[]

  // @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  consolidation_data: { "ConsolidationId": string; "FacilityId": string; "SourceSystemCode": string; "HasRecordLimit": string; "RefType": string; };
  referenceData: any;
  tempArray: any[] = [];

  constructor(public dialog: MatDialog,
              private httpClient: HttpClient,
              public consolidateService:ConsolidationService,
              private transSearchSpinner: NgxSpinnerService) {

  }

  ngOnChanges() {
    this.selected = '10'
    if(this.selectedData) {
      this.referenceData = this.selectedData
      this.consolidation_data = {
        "ConsolidationId": this.referenceData['id'],
        "FacilityId": this.referenceData['facility_id'],
        "SourceSystemCode": this.referenceData['source_system_code'],
        "RefType": this.referenceData['ref_type'],
        "HasRecordLimit": 'true'
      }

      this.showTransaction_data(this.consolidation_data)
    }
  }

  ngOnInit() {
    this.consolidateService.getTransaction_columns().subscribe(data => {
      this.totalDataArray = data;
      this.displayedColumns = this.totalDataArray;
    });

  }

  showTransaction_data(consolidation_data){
    this.total_resArray = [];
    this.dataSource = new MatTableDataSource([]);
    this.paginationShow = false;
    this.pages = [];
    this.pageNumbers = [];
    this.transSearchSpinner.show();
    this.transSearchMessage = 'Loading Data...';
    this.consolidateService.getTransactionTable_data(consolidation_data).subscribe(res => {
      this.transSearchSpinner.hide();
      if (res["totalCount"] > 0) {
        this.count = res["totalCount"];
        // this.count = res["totalCount"] + 55;

        for (var i = 0; i < res["inventroy_transaction"].length; i++) {
          res["inventroy_transaction"][i].actualRcptShipDate = res["inventroy_transaction"][i].actualRcptShipDate !== undefined ? res["inventroy_transaction"][i].actualRcptShipDate + ' UTC' : '';
          res["inventroy_transaction"][i].transactionDate = res["inventroy_transaction"][i].transactionDate !== undefined ? res["inventroy_transaction"][i].transactionDate + ' UTC' : '';
          res["inventroy_transaction"][i].exclusionRunDate = res["inventroy_transaction"][i].exclusionRunDate !== undefined ? res["inventroy_transaction"][i].exclusionRunDate + ' UTC' : '';
          res["inventroy_transaction"][i].updateDate = res["inventroy_transaction"][i].updateDate !== undefined ? res["inventroy_transaction"][i].updateDate + ' UTC' : '';
          res["inventroy_transaction"][i].createDate = res["inventroy_transaction"][i].createDate !== undefined ? res["inventroy_transaction"][i].createDate + ' UTC' : '';
          res["inventroy_transaction"][i].receiptDate = res["inventroy_transaction"][i].receiptDate !== undefined ? res["inventroy_transaction"][i].receiptDate + ' UTC' : '';
        }

        this.total_resArray = res["inventroy_transaction"]
        // for(let i = 0; i< 55; i++) {
        //   this.total_resArray.push(this.total_resArray[0])
        // }

        this.pages_logic()
       
        this.currentPage = 1;
           if(this.currentPage == 1  ){
               this.transactionLoad(true)
            }
      }
    }, err => {
        this.transSearchMessage = 'Error while loading data...';
        this.transSearchSpinner.show();
        setTimeout(() => {
          this.transSearchSpinner.hide();
        }, 3000);
        console.log("Error while loading data : ", err);
    })
  }

  pages_logic(){
    this.pages = [];
        this.pageNumbers = [];
        let showingPages = 0;

        if (this.count === 0) {
          this.paginationShow = false;
        } else {
          this.paginationShow = true;
        }

        if (this.count % parseFloat(this.selected) !== 0) {
          showingPages = (this.count - this.count % parseFloat(this.selected)) / parseFloat(this.selected) + 1;
        } else {
          showingPages = this.count / parseFloat(this.selected);
        }
        for (let i = 1; i <= showingPages; i++) {
          this.pages.push(i);
        }
        this.d = this.chunk(this.pages, 5);
        this.pageNumbers = this.d[this.pagecount];
    
  }

  tablePageChange(event) {
    this.selected = event.value
    this.transactionLoad(true)
  }

  transactionLoad(initial?) {

    if(initial) {
      this.currentPage = 1
      this.pagecount = 0;
    }
    this.pages_logic()
    this.tempArray = []
    this.displayColumns()
    if(this.count > this.selected){
        let x = (this.currentPage-1)*parseFloat(this.selected);
        let y = x + (parseFloat(this.selected) - 1)
        let z ;
          if(y > this.count){
             z = (this.count) - 1
          }else{
             z = y
          }

        for(var i = x; i <= z; i++){
            this.tempArray.push(this.total_resArray[i])
        }
        this.dataSource = new MatTableDataSource(this.tempArray);
        
    } else {
        this.dataSource = new MatTableDataSource(this.total_resArray);
    }
  
  }

  displayColumnsData(totalData) {
    this.filteredData = JSON.parse(JSON.stringify(totalData));
    this.filteredData.forEach(x => {
      let keys = Object.keys(x)
      keys.forEach(key => {
        if (!this.columnsToDisplay.includes(key)) {
          delete x[key]
        }
      });
    });
    this.dataSource = new MatTableDataSource(this.filteredData);
  }

  displayColumns() {
    this.columnsToDisplay = []
    this.displayedColumns.forEach(x => {
      if (x.isVisible === true) {
        this.columnsToDisplay.push(x.dataName)
      }
    })
   
    if (this.columnsToDisplay.length === 0) {
      this.tableShow = false;
    }
    else {
      this.tableShow = true;
    }
   
  }

  openColumns():void{
    let data = this.displayedColumns
    const dialogRef = this.dialog.open(MoreColumnsTransactionsComponent, {
      disableClose: true,
      height:'590px',
      width: '50%',
      autoFocus: false ,
      data: {columns: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.displayedColumns = result
        this.displayColumns()
      } else {
        this.displayedColumns.map(x => {
          if(this.columnsToDisplay.includes(x.dataName)) {
            x.isVisible = true
          } else {
            x.isVisible = false
          }
          return x
        })
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowerCase matches
    this.dataSource.filter = filterValue;
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
    this.transactionLoad()
  }

  backward(p) {
    if (this.pageNumbers.findIndex(x => x === p) === 0) {
      this.pagecount -= 1;
      this.pageNumbers = this.d[this.pagecount]
      this.currentPage = this.pageNumbers[4];
    } else {
      this.currentPage = p - 1;
    }
    this.transactionLoad()
  }

  activePage(p) {
    this.currentPage = p;
    this.transactionLoad()
  }

  first() {
    this.pagecount = 0;
    this.pageNumbers = this.d[0]
    this.currentPage = this.pageNumbers[0]
    this.transactionLoad()
  }

  last() {
    this.pagecount = this.d.length - 1;
    this.pageNumbers = this.d[this.d.length - 1]
    this.currentPage = this.pageNumbers[this.pageNumbers.length - 1]
    this.transactionLoad()
  }

}
