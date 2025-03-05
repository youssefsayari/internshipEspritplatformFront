import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './components/login/login.component';
import { DocumentComponent } from './document/document.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DefenseComponent } from './defense/defense.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { PredefinedDocumentsComponent } from './predefined-documents/predefined-documents.component';
import { GenerateCvComponent } from './generate-cv/generate-cv.component';
import { AddDocumentComponent } from './add-document/add-document.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    DocumentComponent,
    DocumentListComponent,
    DefenseComponent,
    DocumentDetailsComponent,
    PredefinedDocumentsComponent,
    GenerateCvComponent,
    AddDocumentComponent

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
