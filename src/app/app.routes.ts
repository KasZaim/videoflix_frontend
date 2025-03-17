import { Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { LoginComponent } from './log-in/log-in.component'; 
import { SignUpComponent } from './sign-up/sign-up.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';


export const routes: Routes = [
{ path: "", component: StartComponent },
{ path: "privacy-policy", component: PrivacyPolicyComponent },
{ path: "legal-notice", component: LegalNoticeComponent },
{ path: "login", component: LoginComponent},
{ path: "signup", component: SignUpComponent},
{ path: 'verify-email', component: EmailVerificationComponent },
{ path: 'forgot-password', component: ForgotPasswordComponent }, 
{ path: 'reset-password', component:ResetPasswordComponent },
{path: 'dashboard', component: DashboardComponent}
];
