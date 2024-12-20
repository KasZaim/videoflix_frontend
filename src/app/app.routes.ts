import { Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { LogInComponent } from './log-in/log-in.component';

export const routes: Routes = [
{ path: "", component: StartComponent },
{ path: "privacy-policy", component: PrivacyPolicyComponent },
    { path: "legal-notice", component: LegalNoticeComponent },
    { path: "login", component: LogInComponent},
];
