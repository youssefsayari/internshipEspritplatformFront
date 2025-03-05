import { Routes } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { TableListComponent } from '../../components/table-list/table-list.component';
import { TypographyComponent } from '../../components/typography/typography.component';
import { IconsComponent } from '../../components/icons/icons.component';
import { MapsComponent } from '../../components/maps/maps.component';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { UpgradeComponent } from '../../components/upgrade/upgrade.component';
import { AgreementComponent } from '../../components/agreement/agreement.component';
import { InternshipComponent } from '../../components/internship/internship.component';
import { GraduationInternshipComponent } from '../../components/internship/graduation-internship/graduation-internship.component';
import { SummerInternshipComponent } from '../../components/internship/summer-internship/summer-internship.component';
import { DocumentListComponent } from '../../document-list/document-list.component';
import { DocumentComponent } from '../../document/document.component';
import { DefenseComponent } from '../../defense/defense.component';
import { DocumentDetailsComponent } from '../../document-details/document-details.component';

// ✅ Import the PredefinedDocumentsComponent
import { PredefinedDocumentsComponent } from '../../predefined-documents/predefined-documents.component';
import { GenerateCvComponent } from '../../generate-cv/generate-cv.component';
import { AddDocumentComponent } from '../../add-document/add-document.component';





export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'table-list', component: TableListComponent },
  { path: 'typography', component: TypographyComponent },
  { path: 'icons', component: IconsComponent },
  { path: 'maps', component: MapsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'internship', component: InternshipComponent,
    children: [
      { path: 'summer-internship', component: SummerInternshipComponent },
      { path: 'graduation-internship', component: GraduationInternshipComponent }
    ]
  },
  { path: 'agreement', component: AgreementComponent },
  { path: 'document-list', component: DocumentListComponent },
  { path: 'document', component: DocumentComponent },
  { path: 'document-details/:id', component: DocumentDetailsComponent },
  { path: 'defense', component: DefenseComponent },
  { path: 'generate-cv', component: GenerateCvComponent },
  { path: 'add-document', component: AddDocumentComponent },

  // ✅ Added route for predefined documents
  { path: 'predefined-documents', component: PredefinedDocumentsComponent }
];
