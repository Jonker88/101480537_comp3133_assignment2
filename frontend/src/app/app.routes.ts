import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { guestGuard } from './core/guest.guard';
import { ShellComponent } from './shell/shell.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EmployeeAddComponent } from './employees/employee-add/employee-add.component';
import { EmployeeViewComponent } from './employees/employee-view/employee-view.component';
import { EmployeeEditComponent } from './employees/employee-edit/employee-edit.component';
import { EmployeeSearchComponent } from './employees/employee-search/employee-search.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  {
    path: '',
    canActivate: [authGuard],
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'employees' },
      { path: 'employees/add', component: EmployeeAddComponent },
      { path: 'employees/search', component: EmployeeSearchComponent },
      { path: 'employees/view/:id', component: EmployeeViewComponent },
      { path: 'employees/edit/:id', component: EmployeeEditComponent },
      { path: 'employees', component: EmployeeListComponent },
    ],
  },
  { path: '**', redirectTo: 'employees' },
];
