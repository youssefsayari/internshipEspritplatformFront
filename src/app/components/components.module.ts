import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { PostComponent } from './post/post.component';
import { StudentComponent } from './student/student.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import { DialogComponent } from './dialog/dialog.component';
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import { SettingComponent } from './setting/setting.component';
import { DialogInternshipComponent } from './dialog-internship/dialog-internship.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    NotfoundComponent,
    PostComponent,
    StudentComponent,
    DialogComponent,
    SettingComponent,
    DialogInternshipComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class ComponentsModule { }
