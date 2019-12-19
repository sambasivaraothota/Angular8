import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeletePopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
 }

  ngOnInit() {
  }

  onNoClick(msg): void {
    this.dialogRef.close(msg);
  }

  onClick_ok(msg){
    this.dialogRef.close(msg);
  }


}
