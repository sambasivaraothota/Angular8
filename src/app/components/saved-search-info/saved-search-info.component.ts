import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-saved-search-info',
  templateUrl: './saved-search-info.component.html',
  styleUrls: ['./saved-search-info.component.css']
})
export class SavedSearchInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SavedSearchInfoComponent>,@Inject(MAT_DIALOG_DATA) public savedSearchCriteriaInfo: any) {
    dialogRef.disableClose = true;
 }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
