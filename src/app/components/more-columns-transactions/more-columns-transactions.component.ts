import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-more-columns-transactions',
  templateUrl: './more-columns-transactions.component.html',
  styleUrls: ['./more-columns-transactions.component.css']
})
export class MoreColumnsTransactionsComponent implements OnInit {

  columns: any[] = [];
  disableColumns : any[] = ['WHSE Pallet#','Item#​','Transaction Date']
  select_all = false
  clear_all = false;
  columnsToDisplay:string[];

  constructor(public dialogRef: MatDialogRef<MoreColumnsTransactionsComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    //  console.log(this.data.columns)
    window.scrollTo(0,0)
    this.columns = this.data.columns;
  }

  onNoClick(): void {
    this.columns = []
    this.dialogRef.close();
  }

  onClickOk(){
    this.dialogRef.close(this.columns);
  }

  selectAll(){
    this.clear_all = false;
    this.select_all = true;
    for(let i=0;i<this.columns.length;i++){
      this.columns[i].isVisible = true
    }
  }

  clearAll(){
    this.select_all = false;
    this.clear_all = true;
    for(let i=0;i<this.columns.length;i++){
      if (this.disableColumns.indexOf(this.columns[i].name) > -1) {
        this.columns[i].isVisible = true;
      }
      else {
        this.columns[i].isVisible = false;
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}
