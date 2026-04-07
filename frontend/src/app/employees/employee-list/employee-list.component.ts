import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { EmployeeGraphqlService } from '../../core/employee-graphql.service';
import { graphqlErrorMessage } from '../../core/graphql-error.util';
import type { Employee } from '../../models/employee.model';
import { SalaryPipe } from '../../shared/pipes/salary.pipe';
import { FullNamePipe } from '../../shared/pipes/full-name.pipe';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DatePipe,
    SalaryPipe,
    FullNamePipe,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  private readonly graphql = inject(EmployeeGraphqlService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns = ['photo', 'name', 'email', 'department', 'designation', 'salary', 'joined', 'actions'];
  employees: Employee[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.graphql.getAllEmployees().subscribe({
      next: (rows) => {
        this.employees = rows;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = graphqlErrorMessage(err);
      },
    });
  }

  view(id: string): void {
    void this.router.navigate(['/employees/view', id]);
  }

  edit(id: string): void {
    void this.router.navigate(['/employees/edit', id]);
  }

  delete(emp: Employee): void {
    const name = `${emp.first_name} ${emp.last_name}`.trim();
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Delete employee',
          message: `Remove ${name} from the directory? This cannot be undone.`,
          confirmLabel: 'Delete',
          danger: true,
        },
        width: '400px',
      })
      .afterClosed()
      .subscribe((ok) => {
        if (!ok) return;
        this.graphql.deleteEmployee(emp.id).subscribe({
          next: () => {
            this.snackBar.open('Employee deleted', 'Dismiss', { duration: 4000 });
            this.load();
          },
          error: (err) => {
            this.snackBar.open(graphqlErrorMessage(err), 'Dismiss', { duration: 6000 });
          },
        });
      });
  }
}
