import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeGraphqlService } from '../../core/employee-graphql.service';
import { graphqlErrorMessage } from '../../core/graphql-error.util';
import type { Employee } from '../../models/employee.model';
import { SalaryPipe } from '../../shared/pipes/salary.pipe';
import { FullNamePipe } from '../../shared/pipes/full-name.pipe';
import { TrimBlurDirective } from '../../shared/directives/trim-blur.directive';

@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    SalaryPipe,
    FullNamePipe,
    TrimBlurDirective,
  ],
  templateUrl: './employee-search.component.html',
  styleUrl: './employee-search.component.scss',
})
export class EmployeeSearchComponent {
  private readonly fb = inject(FormBuilder);
  private readonly graphql = inject(EmployeeGraphqlService);

  readonly form = this.fb.nonNullable.group({
    department: [''],
    position: [''],
  });

  displayedColumns = ['photo', 'name', 'email', 'department', 'position', 'salary', 'actions'];
  results: Employee[] = [];
  searched = false;
  loading = false;
  error: string | null = null;
  clientError: string | null = null;

  search(): void {
    this.error = null;
    this.clientError = null;
    const department = this.form.controls.department.value.trim();
    const position = this.form.controls.position.value.trim();
    if (!department && !position) {
      this.clientError = 'Enter a department and/or position to search.';
      this.results = [];
      this.searched = false;
      return;
    }
    this.loading = true;
    this.searched = true;
    this.graphql.search(position || null, department || null).subscribe({
      next: (rows) => {
        this.results = rows;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = graphqlErrorMessage(err);
        this.results = [];
      },
    });
  }

  clear(): void {
    this.form.reset({ department: '', position: '' });
    this.results = [];
    this.searched = false;
    this.error = null;
    this.clientError = null;
  }
}
