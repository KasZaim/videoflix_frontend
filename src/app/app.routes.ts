import { Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { LoginComponent } from './log-in/log-in.component'; 
import { SignUpComponent } from './sign-up/sign-up.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';


export const routes: Routes = [
{ path: "", component: StartComponent },
{ path: "privacy-policy", component: PrivacyPolicyComponent },
{ path: "legal-notice", component: LegalNoticeComponent },
{ path: "login", component: LoginComponent},
{ path: "signup", component: SignUpComponent},
{ path: 'verify-email', component: EmailVerificationComponent }
];
