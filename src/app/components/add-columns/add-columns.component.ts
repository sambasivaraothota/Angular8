import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-columns',
  templateUrl: './add-columns.component.html',
  styleUrls: ['./add-columns.component.css']
})
export class AddColumnsComponent implements OnInit {

  columns: any[] = [];
  disableColumns : any[] = ['Facility Id','Customer Id','Select','Customer Reference Number','Order Number/Receipt Number']
  select_all = false
  clear_all = false;
  columnsToDisplay:string[];
  tempColumns: any;

  constructor(public dialogRef: MatDialogRef<AddColumnsComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    window.scrollTo(0,0);
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
      if (this.disableColumns.indexOf(this.columns[i].name) > -1){
        this.columns[i].isVisible = true;
      }
      else {
        this.columns[i].isVisible = false;
      }
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    if(event.previousIndex !== 0 && event.currentIndex !== 0){
      moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }

  }

}
