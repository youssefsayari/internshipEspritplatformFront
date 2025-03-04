import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InternshipRemarkService} from "../../services/internship-remark.service";

@Component({
  selector: 'app-dialog-remark',
  templateUrl: './dialog-remark.component.html',
  styleUrls: ['./dialog-remark.component.scss']
})
export class DialogRemarkComponent implements OnInit {
  remarks: any[] = [];

  constructor(public dialogRef: MatDialogRef<DialogRemarkComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private internshipRemarkService: InternshipRemarkService) {
  }

  ngOnInit(): void {
    this.fetchRemarks(this.data.remark.idInternship);
  }

  fetchRemarks(internshipId: number): void {
    this.internshipRemarkService.getInternshipRemarksByInternshipId(internshipId).subscribe(
      (data) => {
        console.log(data);
        this.remarks = data;
      },
      (error) => {
        console.error('Error fetching remarks:', error);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
