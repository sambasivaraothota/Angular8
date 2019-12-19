import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddColumnsComponent } from '../add-columns/add-columns.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConsolidationService } from 'src/app/services/consolidation.service';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { MessagePopupComponent } from '../message-popup/message-popup.component';
import { SavedSearchInfoComponent } from '../saved-search-info/saved-search-info.component';


@Component({
  selector: 'app-consolidate-page',
  templateUrl: './consolidate-page.component.html',
  styleUrls: ['./consolidate-page.component.css']
})
export class ConsolidatePageComponent implements OnInit {
  ConsolidationForm: FormGroup;
  Ranges = ["Today", "Yesterday", "Tomorrow", "Last 7 Days", "Next 7 Days", "Last 30 Days", "Next 30 Days", "Previous Month", "Current Month", "Custom Range"];
  //Types = ["Adjustment In", "Adjustment Out", "Order", "Receipt", "Storage"];
  Types = ["Adjustment In", "Adjustment Out", "Order", "Receipt", "Storage"];
  Rating_Run = ["All", "Rating Processed", "Not Rating Processed"];
  Storage_Type = ["All", "Freezer", "Cooler", "Dry"];

  dataSource = new MatTableDataSource([]);
  displayedColumns: any[] = [];
  columnsToDisplay: any[] = [];

  count;
  pages = [];
  currentPage = 1;
  pageNumLimit = 10;
  pageNumbers = [];
  d;
  selected = '10';
  pagecount = 0;
  page_from = 0;
  page_to = this.selected;

  consolidation_data: any[] = [];
  expand_open: boolean = false;
  enableExport: boolean = true;
  animate = false;
  showSideNav = true;
  tableShow = false;
  iconShow: boolean;
  search_name: any;
  search_names = [{"ID":"","View_Access":"BL_SAVE","NAME":"","SCHEDULE":false,"CREATED ON":"","LAST MODIFIED":""}];
  filteredData = []
  totalDataArray = [];
  saveOption = false;
  facility_data;
  customer_data;
  selectedFacilityData: any;
  selectedCustomerData: any;
  paginationShow = false;
  selectedrowData: any;
  searchTermValue: any;
  showSearch_criteria = false;
  savedSearchMessage:string = '';
  consSearchMessage: string = '';
  showMessage: boolean = false;
  facility_id: string = '';
  customer_id: string = '';
  source_system_code: string = '';
  savedSearchBody = {};
  userId = localStorage.getItem("userId");
  disableDatePicker: boolean = true;
  rangeFrom: any;
  rangeTo: any;
  rangeFromDate: Date;
  rangeToDate: Date;
  range: string = '';
  searchCriteria_ID: string = '';
  error_msg = true;
  result_filter: string;
  sortField: string = 'actual_rcpt_ship_date';
  sortOrder: string = 'desc';
  fileExportMessage: string = '';
  isSearching = false;
  selectedSaveSearchCriteria: any;
  searchDataWithParams = localStorage.getItem("searchDataWithParams") !== null ? JSON.parse(localStorage.getItem("searchDataWithParams")) : null;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog,
              private httpClient: HttpClient,
              public consolidateService: ConsolidationService,
              private consSearchSpinner: NgxSpinnerService,
              private savedSearchSpinner: NgxSpinnerService,
              private datePipe: DatePipe) {
    this.ConsolidationForm = new FormGroup({
      facility_id: new FormControl('', [Validators.required]),
      customer_id: new FormControl(''),
      item: new FormControl(''),
      warehouse_lot: new FormControl(''),
      manufacture_lot: new FormControl(''),
      customer_ref: new FormControl(''),
      order_receipt: new FormControl(''),
      range: new FormControl('Today', [Validators.required]),
      range_from: new FormControl((new Date()).toISOString(), [Validators.required]),
      range_to: new FormControl((new Date()).toISOString(), [Validators.required]),
      type: new FormControl(["Adjustment In", "Adjustment Out", "Order", "Receipt", "Storage"], [Validators.required]),
      rating_run: new FormControl('All'),
      storage_type: new FormControl('All'),
    });
  }

  onInputBlur(name) {
    if (this.ConsolidationForm.value[name] == ' ') {
      this.ConsolidationForm.patchValue({
        [name]: ''
      })
    }
    this.ConsolidationForm.patchValue({
      [name]: this.ConsolidationForm.value[name].trim()
    })
  }

  ngOnInit() {
    

    if(this.searchDataWithParams !== null && this.searchDataWithParams !== undefined)
    {
      this.displayedColumns = this.searchDataWithParams.displayedColumns;
      this.selected = this.searchDataWithParams.to;
      this.currentPage = this.searchDataWithParams.currentPage;
      this.result_filter = this.searchDataWithParams.searchTerm;
      this.searchTermValue = this.searchDataWithParams.searchTerm;
      this.setDataToControls(this.searchDataWithParams.searchFilters);
      this.getSearchResult(this.searchDataWithParams.searchData,this.searchDataWithParams.from, this.searchDataWithParams.to, this.searchDataWithParams.fromPagination, this.searchDataWithParams.sortField, this.searchDataWithParams.sortOrder, this.searchDataWithParams.searchTerm);
      this.showSearch_criteria = this.searchDataWithParams.showSearch_criteria;
      
    }
    else
    {
      this.error_msg = true;
      this.paginationShow = false;
      this.showSideNav = true;
      //this.dataSource.sort = this.sort;
      this.consolidateService.getConsolidation_columns().subscribe(data => {
        this.totalDataArray = data;
        this.displayedColumns = this.totalDataArray;
        // this.dataSource.sort = this.sort;
      })
    }
  }

  dateRangeChanged(selected_dateRange) {
    var dt = new Date();
    this.disableDatePicker = true;
    switch(selected_dateRange)
    {
      case 'Today':
        this.ConsolidationForm.patchValue({
          range_from: dt,
          range_to: dt
        })
        break;

      case 'Yesterday':
        dt.setDate(dt.getDate() - 1);
        this.ConsolidationForm.patchValue({
          range_from: dt,
          range_to: dt
        })
        break;

      case 'Tomorrow':
        dt.setDate(dt.getDate() + 1);
        this.ConsolidationForm.patchValue({
          range_from: dt,
          range_to: dt
        })
        break;

      case 'Last 7 Days':
        var date_from =new Date();
        date_from.setDate(dt.getDate() - 7);
        var date_to =new Date();
        date_to.setDate(dt.getDate() -1);
        this.ConsolidationForm.patchValue({
          range_from: date_from,
          range_to: date_to
        })
        break;

      case 'Next 7 Days':
        var date_from =new Date();
        date_from.setDate(dt.getDate() + 1);
        var date_to =new Date();
        date_to.setDate(dt.getDate() + 7);
        this.ConsolidationForm.patchValue({
          range_from:date_from,
          range_to:date_to
        })
        break;

      case 'Last 30 Days':
        var date_from = new Date();
        date_from.setDate(dt.getDate() - 30);
        var date_to =new Date();
        date_to.setDate(dt.getDate() -1);
        this.ConsolidationForm.patchValue({
          range_from: date_from,
          range_to: date_to
        })
        break;

      case 'Next 30 Days':
        var date_from = new Date();
        date_from.setDate(dt.getDate() +1);
        var date_to =new Date();
        date_to.setDate(dt.getDate() + 30);
        this.ConsolidationForm.patchValue({
          range_from: date_from,
          range_to: date_to
        })
        break;

      case 'Previous Month':
        var date_from = new Date();
        var date_to = new Date();
        date_from.setMonth(dt.getMonth()-1);
        date_from.setDate(1);
        date_to.setDate(1);
        date_to.setDate(date_to.getDate()-1);
        this.ConsolidationForm.patchValue({
          range_from: date_from,
          range_to: date_to
        })
        break;

      case 'Current Month':
        var date_from = new Date();
        var date_to = new Date();
        date_from.setDate(1);
        date_to.setMonth(dt.getMonth()+1);
        date_to.setDate(1);
        date_to.setDate(date_to.getDate()-1);
        this.ConsolidationForm.patchValue({
          range_from: date_from,
          range_to: date_to
        })
        break;

      case 'Custom Range':
        // this.ConsolidationForm.patchValue({
        // range_from: '',
        // range_to: ''
        // })
        this.disableDatePicker = false;
        break;
    }
  }

  tablePageChange(event) {
    // this.onSearchClick(this.searchTermValue)
    this.onSearchClick(this.searchTermValue,true)
  }

  displayColumns() {
    this.columnsToDisplay = [];
    this.displayedColumns.forEach(x => {
      if (x.isVisible === true) {
        this.columnsToDisplay.push(x.dataName);
      }
    });

    if(this.searchDataWithParams !== null && this.searchDataWithParams !== undefined)
    {
        this.searchDataWithParams.displayedColumns = this.displayedColumns;
        localStorage.setItem("searchDataWithParams", JSON.stringify(this.searchDataWithParams));
    }

    if (this.columnsToDisplay.length === 0) {
      this.tableShow = false;
    }
    else {
      this.tableShow = true;
    }
    //this.dataSource.sort = this.sort;
  }

  keyDownHandler(event) {
    if (event.target.value.length === 0) {
      if (event.keyCode === 32)
        event.preventDefault();
    }
  }

  facility_search(event) {
    if (event.target.value.length > 2) {
      if (event.keyCode !== 38 && event.keyCode !== 40){
         if(!this.isSearching)
         {
            this.isSearching = true;
            this.setFacilityData(event.target.value);
         }
         else 
         { 
            setTimeout(() => { this.setFacilityData(event.target.value) }, 1000);
         }
      }
    }
  }

  setFacilityData(searchText){
       this.facility_data = [];
       this.consolidateService.getFacility(searchText).subscribe(res => {
          this.facility_data = res["facility_data"];
          this.isSearching = false;      
        }, err => { this.isSearching = false;});
  }

  facilitySelect(data) {
    this.selectedFacilityData = data.option.value
    this.ConsolidationForm.patchValue({
      facility_id: data.option.value.value,
      customer_id: ''
    })
    this.selectedCustomerData = null
  }

  customer_search(event) {
    let facilityData = {
      "facility_key": this.selectedFacilityData.key,
      "customer_search": event.target.value,
      "source": this.selectedFacilityData.misc1
    }
    if (event.target.value.length > 0) {
      this.consolidateService.getCustomer(facilityData).subscribe(res => {
        this.customer_data = res["customer_data"];
      })
    }
  }

  customerSelect(data) {
    this.selectedCustomerData = data.option.value
    this.ConsolidationForm.patchValue({
      customer_id: data.option.value.value
    })
  }

  selectCriteria() {
    let sc_from = 1;
    let sc_size = 1000;
    this.consolidateService.saveSearchCriteriaView(this.userId, sc_from, sc_size, 'undefined').subscribe((res: any) => {
      if (res !== undefined && res !== '' && res.statusCode === "200") {
        if (res.savedData && res.savedData.length > 0) {
          this.search_names = res.savedData;
          //this.iconShow = true;
        }
        else{
          this.search_names = [{"ID":"","View_Access":"BL_SAVE","NAME":"No Data Found","SCHEDULE":false,"CREATED ON":"","LAST MODIFIED":""}];
        }
      }
    }, err => {
      console.log("Error while fetching the SavedSearch criteria list : ", err);
    })
    /*this.search_name = event.value;
     this.iconShow = true;*/
  }

  selectedCriteria(event) {
    if(event.value.ID !=""){
      this.selectedSaveSearchCriteria = event.value;
      this.searchCriteria_ID = event.value.ID;
      this.search_name = event.value.NAME;
      this.saveOption = true;
      this.iconShow = true;
    }
  }

  //Search criteria options search...
  onSaveSearch(name) {
    if (this.selectedFacilityData && this.ConsolidationForm.value.facility_id !== "") {
      if (this.selectedFacilityData.misc1 && this.selectedFacilityData.misc1 !== '') {
        this.source_system_code = this.selectedFacilityData.misc1;
      }

      var refTypes = this.ConsolidationForm.value.type;
      if (refTypes) {
        if (refTypes.find(rf => rf === "All")) {
          refTypes = ["Adjustment In", "Adjustment Out", "Order", "Receipt", "Storage"]
        }
      }

      let searchData = {
        "FACILITY_ID": this.selectedFacilityData ? this.selectedFacilityData.key : '',
        "FACILITY_Value": this.selectedFacilityData ? this.selectedFacilityData.value : '',
        "FACILITY_Misc2": this.selectedFacilityData ? this.selectedFacilityData.misc2 : '',
        "CUSTOMER_ID": this.selectedCustomerData ? this.selectedCustomerData.key : '',
        "CUSTOMER_Value": this.selectedCustomerData ? this.selectedCustomerData.value : '',
        "CUSTOMER_Misc2": this.selectedCustomerData ? this.selectedCustomerData.misc2 : '',
        "SOURCE_SYSTEM_CODE": this.source_system_code,
        "Range": this.ConsolidationForm.value.range,
        "FromDate": new Date(this.ConsolidationForm.value.range_from).toISOString(),
        "ToDate": new Date(this.ConsolidationForm.value.range_to).toISOString(),
        "REF_TYPE": refTypes,
        "RATING_RUN": this.ConsolidationForm.value.rating_run,
        "MANUFACTURER_LOT_NUMBER" :  this.ConsolidationForm.value.manufacture_lot,
        "ITEM_ID" :  this.ConsolidationForm.value.item,
        "WHSE_LOT_NUMBER" : this.ConsolidationForm.value.warehouse_lot,
        "HDR_INTERNAL_ID" : this.ConsolidationForm.value.order_receipt,
        "CUST_REF_NUM" : this.ConsolidationForm.value.customer_ref,
        "STORAGE_TYPE" : this.ConsolidationForm.value.storage_type
      }

      const savedSearchRequest = {
        Search_Name: name,
        Search_Criteria_Value: searchData,
        Selected_Columns: this.columnsToDisplay,
        View_Access: "BL_SAVE",
        Is_Scheduled: 0,
        User_SavedSearch: this.userId,
        CreatedBy: this.userId,
        LastUpdatedBy: this.userId
      }

      //this.savedSearchSpinner.show();
      //this.savedSearchMessage = 'Saving Search Criteria...';
      this.consolidateService.saveSearchCriteria(savedSearchRequest).subscribe((res: any) => {
        if (res !== undefined && res !== '' && res.statusCode === "200") {
          //this.savedSearchSpinner.hide();
          this.dialog.open(MessagePopupComponent, {
            disableClose: true,
            //height: '250px',
            width: '450px',
            autoFocus: false,
            data: "Search criteria saved successfully"
          });
        }
      }, err => {
        /*this.savedSearchMessage = 'Error while saving Search Criteria...';
         this.savedSearchSpinner.show();
         setTimeout(() => {
         this.savedSearchSpinner.hide();
         }, 5000);
         console.log("Error while saving the SearchCriteria : ", err);*/
      });
    }
    else
    {
      this.ConsolidationForm.controls['facility_id'].setErrors({'incorrect': true});
      this.ConsolidationForm.controls['facility_id'].markAsTouched();
    }
  }

  onClearSearch(name) {
    for (var i = 0; i < this.search_names.length; i++) {
      if (this.search_names[i] === name) {
        this.search_names.splice(i, 1);
      }
    }
    this.search_name = "";
    this.saveOption = false;
  }

  onApplySearch() {
    this.consolidateService.applySearchCriteria(this.searchCriteria_ID).subscribe((res: any) => {
      if (res !== undefined && res !== '' && res.statusCode === "200") {
        this.setDataToControls(res.SavedSearch);
      }
    }, err => {
      console.log("Error while applying the search criteria : ", err);
    });
  }

  setDataToControls(savedSearch){
        this.rangeFrom = savedSearch.FromDate;
        this.rangeTo = savedSearch.ToDate;
        this.range = savedSearch.Range;
        if (this.range === 'Custom Range') {
          this.disableDatePicker = false;
          this.ConsolidationForm.controls.range_from.enable();
          this.ConsolidationForm.controls.range_to.enable();
        }

        var refTypes = savedSearch.REF_TYPE;

        if (refTypes) {
          if ((typeof refTypes === "string" && refTypes === "All") || (typeof refTypes === "object" && refTypes.find(rf => rf === "All"))) {
            refTypes = ["Adjustment In", "Adjustment Out", "Order", "Receipt", "Storage"]
          }
          else
          {
            if(typeof refTypes === "string" )
            {
              if(refTypes.indexOf("[") >= 0)
                refTypes = JSON.parse(refTypes)
              else
                refTypes = refTypes.split(",");
            }
          }
        }

        this.ConsolidationForm.setValue({
          facility_id: savedSearch.FACILITY_Value ? savedSearch.FACILITY_Value : '',
          customer_id: savedSearch.CUSTOMER_Value ? savedSearch.CUSTOMER_Value : '',
          item: savedSearch.ITEM_ID ? savedSearch.ITEM_ID : '',
          warehouse_lot: savedSearch.WHSE_LOT_NUMBER ? savedSearch.WHSE_LOT_NUMBER : '',
          manufacture_lot: savedSearch.MANUFACTURER_LOT_NUMBER ? savedSearch.MANUFACTURER_LOT_NUMBER : '',
          customer_ref: savedSearch.CUST_REF_NUM ? savedSearch.CUST_REF_NUM : '',
          order_receipt: savedSearch.HDR_INTERNAL_ID ? savedSearch.HDR_INTERNAL_ID : '',
          range: this.range ? this.range : 'Today',
          rating_run: savedSearch.RATING_RUN ? savedSearch.RATING_RUN : 'All',
          range_from: this.rangeFrom ? this.rangeFrom : '',
          range_to: this.rangeTo ? this.rangeTo : '',
          type: refTypes,
          storage_type: savedSearch.STORAGE_TYPE ? savedSearch.STORAGE_TYPE : 'All'
        });
        this.facility_id = savedSearch.FACILITY_ID ? savedSearch.FACILITY_ID : '';
        this.selectedFacilityData = {"key" : savedSearch.FACILITY_ID , "value" : savedSearch.FACILITY_Value, "misc2" : savedSearch.FACILITY_Misc2 };
        this.customer_id = savedSearch.CUSTOMER_ID ? savedSearch.CUSTOMER_ID : '';
        this.selectedCustomerData = {"key" : savedSearch.CUSTOMER_ID , "value" : savedSearch.CUSTOMER_Value, "misc2" : savedSearch.CUSTOMER_Misc2 };
        this.source_system_code = savedSearch.SOURCE_SYSTEM_CODE ? savedSearch.SOURCE_SYSTEM_CODE : '';
  }

  onDeleteSearch() {
    let deleteSearchCriteria = {
      "User_savedSearch": this.userId,
      "LastUpdatedBy": this.userId
    }
    this.consolidateService.deleteSearchCriteria(deleteSearchCriteria, this.searchCriteria_ID).subscribe((res: any) => {
      if (res !== undefined && res !== '' && res.statusCode === "200") {
        this.search_name = '';
        this.selectCriteria();
        this.saveOption = false;

        this.dialog.open(MessagePopupComponent, {
          disableClose: true,
          //height: '250px',
          width: '450px',
          autoFocus: false,
          data: "Search criteria deleted successfully"
        });

      }
    }, err => {
      //console.log("Error while deleting the Search criteria : ", err);
    });

  }

  onInfoSearch() {
    this.dialog.open(SavedSearchInfoComponent, {
      disableClose: true,
      //height: '250px',
      width: '550px',
      autoFocus: false,
      data: this.selectedSaveSearchCriteria
    });
  }

  onSearch(searchTerm, from, to, fromPagination, sortField, sortOrder) {
    var loadData = true;
    if(!fromPagination){
      this.dataSource = new MatTableDataSource([]);
      this.count = 0;
      this.columnsToDisplay = [];
      this.paginationShow = false;
      this.showSideNav = true;
    }

    if (this.selectedFacilityData) {
      if (this.selectedFacilityData.key && this.selectedFacilityData.key !== '') {
        this.facility_id = this.selectedFacilityData.key;
      }
      if (this.selectedFacilityData.misc1 && this.selectedFacilityData.misc1 !== '') {
        this.source_system_code = this.selectedFacilityData.misc1;
      }
    }

    if (this.selectedCustomerData) {
      if (this.selectedCustomerData.key && this.selectedCustomerData.key !== '') {
        this.customer_id = this.selectedCustomerData.key;
      }
    }

    if (this.ConsolidationForm.controls['customer_id'].touched) {
      if (this.ConsolidationForm.value.customer_id == "") {
        this.customer_id = '';
      }
    }

    this.rangeFrom = new Date(this.ConsolidationForm.value.range_from);//.toLocalString();
    this.rangeTo = new Date(this.ConsolidationForm.value.range_to);//.toLocalString();

    if(this.ConsolidationForm.value.range == "Custom Range") {
       var timeDiff = Math.abs(this.rangeTo.getTime() - this.rangeFrom.getTime());
       var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
       if(diffDays > 93){
        loadData = false;
        this.dialog.open(MessagePopupComponent, {
                        disableClose: true,
                        width: '450px',
                        autoFocus: false,
                        data: "End date should be less than 93 days(approx. quarter) of Start date"
        });
      }
    }

    this.rangeFrom = this.rangeFrom.getFullYear() + '-' + (this.rangeFrom.getMonth()+1 < 10 ? '0' +
        (this.rangeFrom.getMonth()+1) : this.rangeFrom.getMonth()+1  ) + '-' +
        (this.rangeFrom.getDate() < 10 ? '0' : '') + this.rangeFrom.getDate() + 'T00:00:00Z';
    this.rangeTo = this.rangeTo.getFullYear() + '-' + (this.rangeTo.getMonth()+1 < 10 ? '0' +
        (this.rangeTo.getMonth()+1) : this.rangeTo.getMonth()+1  ) + '-' +
        (this.rangeTo.getDate() < 10 ? '0' : '') + this.rangeTo.getDate() + 'T23:59:00Z';

    if(loadData) {
      var refTypes = this.ConsolidationForm.value.type;
      if (refTypes) {
        if (refTypes.find(rf => rf === "All")) {
          refTypes = ["Adjustment In", "Adjustment Out", "Order", "Receipt", "Storage"]
        }
      }

      let searchData = {
        "FACILITY_ID": this.facility_id,
        "CUSTOMER_ID": this.customer_id,
        "SOURCE_SYSTEM_CODE": this.source_system_code,
        "FromDate": this.rangeFrom,
        "ToDate": this.rangeTo,
        "REF_TYPE": refTypes,
        "RATING_RUN": this.ConsolidationForm.value.rating_run,
        "MANUFACTURER_LOT_NUMBER" :  this.ConsolidationForm.value.manufacture_lot,
        "ITEM_ID" :  this.ConsolidationForm.value.item,
        "WHSE_LOT_NUMBER" : this.ConsolidationForm.value.warehouse_lot,
        "HDR_INTERNAL_ID" : this.ConsolidationForm.value.order_receipt,
        "CUST_REF_NUM" : this.ConsolidationForm.value.customer_ref,
        "STORAGE_TYPE" : this.ConsolidationForm.value.storage_type
      }


      let searchFilters = {
        "FACILITY_ID": this.facility_id,
        "CUSTOMER_ID": this.customer_id,
        "SOURCE_SYSTEM_CODE": this.source_system_code,
        "FromDate": this.ConsolidationForm.value.range_from,
        "ToDate": this.ConsolidationForm.value.range_to,
        "REF_TYPE": refTypes,
        "RATING_RUN": this.ConsolidationForm.value.rating_run,
        "MANUFACTURER_LOT_NUMBER" :  this.ConsolidationForm.value.manufacture_lot,
        "ITEM_ID" :  this.ConsolidationForm.value.item,
        "WHSE_LOT_NUMBER" : this.ConsolidationForm.value.warehouse_lot,
        "HDR_INTERNAL_ID" : this.ConsolidationForm.value.order_receipt,
        "CUST_REF_NUM" : this.ConsolidationForm.value.customer_ref,
        "STORAGE_TYPE" : this.ConsolidationForm.value.storage_type,
        "FACILITY_Value": this.selectedFacilityData ? this.selectedFacilityData.value : '',
        "FACILITY_Misc2": this.selectedFacilityData ? this.selectedFacilityData.misc2 : '',
        "CUSTOMER_Value": this.selectedCustomerData ? this.selectedCustomerData.value : '',
        "CUSTOMER_Misc2": this.selectedCustomerData ? this.selectedCustomerData.misc2 : '',
        "Range": this.ConsolidationForm.value.range
      }
      
      this.searchDataWithParams = {
        "searchData" : searchData,
        "searchFilters": searchFilters,
        "from" : from,
        "to": to,
        "fromPagination" : fromPagination,
        "sortField" : sortField,
        "sortOrder": sortOrder,
        "searchTerm": searchTerm,
        "showSearch_criteria" : this.showSearch_criteria,
        "currentPage":this.currentPage,
        "Selected_Columns": this.columnsToDisplay
      }

      localStorage.setItem("searchDataWithParams", JSON.stringify(this.searchDataWithParams));

      this.consSearchSpinner.show();
      this.consSearchMessage = 'Loading Data...';
      this.getSearchResult(searchData,from, to, fromPagination, sortField, sortOrder,searchTerm);
      
    }
  }

  getSearchResult(searchData,from, to, fromPagination, sortField, sortOrder,searchTerm){
    this.consolidateService.getConsolidationTable_data(searchData, from, to, sortField, sortOrder, searchTerm).subscribe((res : any) => {
        // console.log(res["totalCount"])
        this.consSearchSpinner.hide();
        if(res.Status == 200 || res.statusCode == 200) {
          // this.error_msg = false
          this.count = res["totalCount"];
          let totalData =  [];

          res["inventory_consolidation"].forEach(element => {
            totalData.push(element['_source']);
          });

          for(var i=0;i<totalData.length ;i++){
            totalData[i].actual_rcpt_ship_date = totalData[i].actual_rcpt_ship_date !== undefined ? totalData[i].actual_rcpt_ship_date + ' UTC' : '';
            totalData[i].calculation_date = totalData[i].calculation_date !== undefined ? totalData[i].calculation_date + ' UTC' : '';
            totalData[i].create_date = totalData[i].create_date !== undefined ? totalData[i].create_date + ' UTC' : '';
            totalData[i].dispatched_date = totalData[i].dispatched_date !== undefined ? totalData[i].dispatched_date + ' UTC' : '';
            totalData[i].transaction_date = totalData[i].transaction_date !== undefined ? totalData[i].transaction_date + ' UTC' : '';
            totalData[i].receipt_date = totalData[i].receipt_date !== undefined ? totalData[i].receipt_date + ' UTC' : '';
            totalData[i].consolidation_date = totalData[i].consolidation_date !== undefined ? totalData[i].consolidation_date + ' UTC' : '';
          }

          this.dataSource = new MatTableDataSource(totalData);
          //this.dataSource.sort = this.sort;
          this.pages = [];
          this.pageNumbers = [];
          let showingPages = 0;

          if(this.count){
            this.paginationShow = true;
            this.displayColumns();
            this.showSideNav = false;
            this.error_msg = false;
          }else{
           this.paginationShow = false;
           this.error_msg = true;
          }

          if(this.count%parseFloat(this.selected) !== 0) {
            showingPages = (this.count - this.count%parseFloat(this.selected))/parseFloat(this.selected) + 1;
          } else {
            showingPages = this.count/parseFloat(this.selected);
          }
          for (let i = 1; i <= showingPages; i++) {
            this.pages.push(i);
          }
          this.d = this.chunk(this.pages, 5);
          this.pageNumbers = this.d[this.pagecount];
        }
        //this.dataSource.sort = this.sort;
      }, err => {
          this.consSearchMessage = 'Error while loading data...';
          this.savedSearchSpinner.show();
          setTimeout(() => {
            this.savedSearchSpinner.hide();
          }, 5000);
      });
  }

  onSearchClick(searchTerm, initial?) {
    

    if (this.ConsolidationForm.value.facility_id == "") {
      this.ConsolidationForm.controls['facility_id'].setErrors({'incorrect': true});
      this.ConsolidationForm.controls['facility_id'].markAsTouched();
    }
    else{
      if(initial) {
        this.currentPage = 1;
        this.pagecount = 0;
        //this.showSideNav = false;
        this.showSearch_criteria = true;
        this.onSearch(searchTerm, (this.currentPage - 1) * parseFloat(this.selected), this.selected, false, this.sortField, this.sortOrder);
        this.result_filter = '';
        this.searchTermValue = '';
      }
      else
      {
        this.onSearch(searchTerm, (this.currentPage - 1) * parseFloat(this.selected), this.selected, true, this.sortField, this.sortOrder);
      }
    }
  }

  onSearchAdd(event) {
    if (event.target.value.length > 0) {
      this.saveOption = true;
    } else {
      this.saveOption = false;
    }
    this.iconShow = false;
  }

  //Results Filter Search Criteria Functionality
  resultsFilterSearch(filterValue: string, initial) {
    this.searchTermValue = filterValue;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if(initial) {
      this.currentPage = 1;
      this.onSearch(filterValue, (this.currentPage-1)*parseFloat(this.selected), this.selected, false, this.sortField, this.sortOrder);
    }
    else
    {
      this.onSearch(filterValue, (this.currentPage-1)*parseFloat(this.selected), this.selected, true, this.sortField, this.sortOrder);
    }
  }

  //FileExport Functionality
  FileExport() {
    this.enableExport = false;
    this.fileExportMessage = "Downloading file..."
    let searchData = {
      "FACILITY_ID": this.facility_id,
      "CUSTOMER_ID": this.customer_id,
      "SOURCE_SYSTEM_CODE": this.source_system_code,
      "FromDate": this.rangeFrom,
      "ToDate": this.rangeTo,
      "REF_TYPE": this.ConsolidationForm.value.type,
      "MANUFACTURER_LOT_NUMBER" :  this.ConsolidationForm.value.manufacture_lot,
      "ITEM_ID" :  this.ConsolidationForm.value.item,
      "WHSE_LOT_NUMBER" : this.ConsolidationForm.value.warehouse_lot,
      "HDR_INTERNAL_ID" : this.ConsolidationForm.value.order_receipt,
      "CUST_REF_NUM" : this.ConsolidationForm.value.customer_ref,
      "STORAGE_TYPE" : this.ConsolidationForm.value.storage_type,
      "RATING_RUN": this.ConsolidationForm.value.rating_run,
    }
    this.consolidateService.fileExport(searchData, 0, this.count, this.searchTermValue).subscribe((res: any) => {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(res.data, res.filename);
      } else {
        const link = window.URL.createObjectURL(res.data);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = link;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(link);
        a.remove();
      }
    }, err => {
      console.log("Unable to export the file, due to: ", err);
      this.dialog.open(MessagePopupComponent, {
                      disableClose: true,
                      width: '450px',
                      autoFocus: false,
                      data: "Unable to export the file, due to some error "
                    });
      this.enableExport = true;
      this.fileExportMessage = "";
    }, () => {
      console.log('Completed file download.');
      this.fileExportMessage = "";
      this.dialog.open(MessagePopupComponent, {
        disableClose: true,
        width: '450px',
        autoFocus: false,
        data: "Completed file download."
      });
      this.enableExport = true;
    });
  }

  sortData(event) {
    this.sortField = event.active;
    this.sortOrder = event.direction;
    this.onSearch(this.searchTermValue, (this.currentPage - 1) * parseFloat(this.selected), this.selected, true, event.active, event.direction);
  }

  expandConsolidation(row?) {
    this.selectedrowData = row;
    this.expand_open = !this.expand_open;
    this.animate = true;
  }

  showSearchOptions() {
    this.showSideNav = !this.showSideNav
  }

  showSearchCriteria(){
    this.showSearch_criteria = !this.showSearch_criteria;
    if(this.searchDataWithParams !== null && this.searchDataWithParams !== undefined)
    {
      this.searchDataWithParams.showSearch_criteria = this.showSearch_criteria;
      localStorage.setItem("searchDataWithParams", JSON.stringify(this.searchDataWithParams));
    }
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
    this.onSearchClick(this.searchTermValue, false);
  }

  backward(p) {
    if (this.pageNumbers.findIndex(x => x === p) === 0) {
      this.pagecount -= 1;
      this.pageNumbers = this.d[this.pagecount]
      this.currentPage = this.pageNumbers[4];
    } else {
      this.currentPage = p - 1;
    }
    this.onSearchClick(this.searchTermValue, false)
  }

  activePage(p) {
    this.currentPage = p;
    this.onSearchClick(this.searchTermValue, false);
  }

  first() {
    this.pagecount = 0;
    this.pageNumbers = this.d[0]
    this.currentPage = this.pageNumbers[0]
    this.onSearchClick(this.searchTermValue, false);
  }

  last() {
    this.pagecount = this.d.length - 1;
    this.pageNumbers = this.d[this.d.length - 1]
    this.currentPage = this.pageNumbers[this.pageNumbers.length - 1]
    this.onSearchClick(this.searchTermValue, false)
  }

  openColumns(): void {
    let data = this.displayedColumns
    const dialogRef = this.dialog.open(AddColumnsComponent, {
      disableClose: true,
      height: '590px',
      width: '50%',
      autoFocus: false,
      data: { columns: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result
        this.displayColumns()
      } else {
        this.displayedColumns.map(x => {
          if (this.columnsToDisplay.includes(x.dataName)) {
            x.isVisible = true
          } else {
            x.isVisible = false
          }
          return x
        })
      }
    });
  }
}
