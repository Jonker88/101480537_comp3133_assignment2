import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';
import { EmployeeGraphqlService } from '../../core/employee-graphql.service';
import { graphqlErrorMessage } from '../../core/graphql-error.util';
import { TrimBlurDirective } from '../../shared/directives/trim-blur.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TrimBlurDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly graphql = inject(EmployeeGraphqlService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    usernameOrEmail: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  serverError: string | null = null;
  infoMessage: string | null = null;

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('registered') === '1') {
      this.infoMessage = 'Account created. Sign in with your new credentials.';
    }
  }

  submit(): void {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { usernameOrEmail, password } = this.form.getRawValue();
    this.loading = true;
    this.graphql.login(usernameOrEmail, password).subscribe({
      next: (res) => {
        this.auth.setSession(res.token, res.user);
        this.loading = false;
        void this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.serverError = graphqlErrorMessage(err);
      },
    });
  }
}
