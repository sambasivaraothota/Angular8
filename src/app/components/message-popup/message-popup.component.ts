import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.css']
})
export class MessagePopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MessagePopupComponent>,@Inject(MAT_DIALOG_DATA) public message: any) {
    dialogRef.disableClose = true;
 }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
