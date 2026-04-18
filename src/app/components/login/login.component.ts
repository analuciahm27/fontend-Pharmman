import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 onSubmit(): void {
  if (this.form.invalid) return;

  const { email, password } = this.form.value;

  this.auth.login(email, password).subscribe({
    next: (resp) => {
      // redirige según rol
      resp.rol === 'ADMIN'
        ? this.router.navigate(['/dashboard'])
        : this.router.navigate(['/ventas/registro']);
    },
    error: () => {
      this.errorMsg = 'Credenciales incorrectas o usuario inactivo.';
    }
  });
}
}
