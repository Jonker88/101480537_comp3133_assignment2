import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeGraphqlService } from '../../core/employee-graphql.service';
import { graphqlErrorMessage } from '../../core/graphql-error.util';
import { TrimBlurDirective } from '../../shared/directives/trim-blur.directive';
import { readImageAsDataUrl } from '../../shared/file-upload.util';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    TrimBlurDirective,
    RouterLink,
  ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss',
})
export class EmployeeAddComponent {
  private readonly fb = inject(FormBuilder);
  private readonly graphql = inject(EmployeeGraphqlService);
  private readonly router = inject(Router);
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
  photoPreview: string | null = null;
  photoDataUrl: string | null = null;
  fileError: string | null = null;

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.fileError = null;
    if (!file) {
      this.photoPreview = null;
      this.photoDataUrl = null;
      return;
    }
    try {
      const dataUrl = await readImageAsDataUrl(file);
      this.photoDataUrl = dataUrl;
      this.photoPreview = dataUrl;
    } catch (e) {
      this.photoDataUrl = null;
      this.photoPreview = null;
      this.fileError = e instanceof Error ? e.message : 'Invalid file';
      input.value = '';
    }
  }

  clearPhoto(): void {
    this.photoPreview = null;
    this.photoDataUrl = null;
    this.fileError = null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.loading = true;
    this.graphql
      .addEmployee({
        first_name: v.first_name,
        last_name: v.last_name,
        email: v.email,
        gender: v.gender,
        designation: v.designation,
        salary: Number(v.salary),
        date_of_joining: v.date_of_joining,
        department: v.department,
        employee_photo: this.photoDataUrl,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Employee added', 'Dismiss', { duration: 4000 });
          void this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(graphqlErrorMessage(err), 'Dismiss', { duration: 7000 });
        },
      });
  }
}
