import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InternshipRemarkService} from "../../Services/internship-remark.service";
import {InternshipRemark} from "../../models/internship-remark";
import {Remark} from "../../models/remark";

@Component({
  selector: 'app-dialog-remark',
  templateUrl: './dialog-remark.component.html',
  styleUrls: ['./dialog-remark.component.scss']
})
export class DialogRemarkComponent implements OnInit {
  remarks: Remark[] = [];


  constructor(public dialogRef: MatDialogRef<DialogRemarkComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private internshipRemarkService: InternshipRemarkService) {
    this.remarks = data.remarks;
  }

  ngOnInit(): void {
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

}
