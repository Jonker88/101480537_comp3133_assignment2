import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeGraphqlService, type UpdateEmployeePatch } from '../../core/employee-graphql.service';
import { graphqlErrorMessage } from '../../core/graphql-error.util';
import { TrimBlurDirective } from '../../shared/directives/trim-blur.directive';
import { readImageAsDataUrl } from '../../shared/file-upload.util';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TrimBlurDirective,
    RouterLink,
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
})
export class EmployeeEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly graphql = inject(EmployeeGraphqlService);
  private readonly snackBar = inject(MatSnackBar);

  readonly genders = ['Male', 'Female', 'Other'] as const;

  readonly form = this.fb.nonNullable.group({
    first_name: ['', [Validators.required, Validators.maxLength(80)]],
    last_name: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    gender: ['Male' as string, Validators.required],
    designation: ['', [Validators.required, Validators.maxLength(120)]],
    salary: [1000, [Validators.required, Validators.min(1000)]],
    date_of_joining: ['', Validators.required],
    department: ['', [Validators.required, Validators.maxLength(120)]],
  });

  loading = false;
  loadError: string | null = null;
  initialLoad = true;
  employeeId: string | null = null;

  photoPreview: string | null = null;
  photoDataUrl: string | null = null;
  fileError: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigate(['/employees']);
      return;
    }
    this.employeeId = id;
    this.graphql.getEmployeeById(id).subscribe({
      next: (emp) => {
        this.initialLoad = false;
        if (!emp) {
          this.loadError = 'Employee not found';
          return;
        }
        const d =
          typeof emp.date_of_joining === 'string'
            ? emp.date_of_joining.slice(0, 10)
            : new Date(emp.date_of_joining).toISOString().slice(0, 10);
        this.form.patchValue({
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          gender: emp.gender,
          designation: emp.designation,
          salary: emp.salary,
          date_of_joining: d,
          department: emp.department,
        });
        this.photoPreview = emp.employee_photo;
      },
      error: (err) => {
        this.initialLoad = false;
        this.loadError = graphqlErrorMessage(err);
      },
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.fileError = null;
    if (!file) {
      return;
    }
    try {
      const dataUrl = await readImageAsDataUrl(file);
      this.photoDataUrl = dataUrl;
      this.photoPreview = dataUrl;
    } catch (e) {
      this.fileError = e instanceof Error ? e.message : 'Invalid file';
      input.value = '';
    }
  }

  submit(): void {
    if (!this.employeeId) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.loading = true;
    const patch: UpdateEmployeePatch = {
      first_name: v.first_name,
      last_name: v.last_name,
      email: v.email,
      gender: v.gender,
      designation: v.designation,
      salary: Number(v.salary),
      date_of_joining: v.date_of_joining,
      department: v.department,
    };
    if (this.photoDataUrl) {
      patch.employee_photo = this.photoDataUrl;
    }
    this.graphql.updateEmployee(this.employeeId, patch).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Employee updated', 'Dismiss', { duration: 4000 });
        void this.router.navigate(['/employees/view', this.employeeId!]);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(graphqlErrorMessage(err), 'Dismiss', { duration: 7000 });
      },
    });
  }
}
