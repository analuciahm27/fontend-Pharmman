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
      if (resp.mustChangePassword) return; // AuthService ya redirige a /update-password
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      if (err.error?.error === 'usuario_inactivo') {
        this.errorMsg = 'Tu cuenta está desactivada. Contacta al administrador.';
      } else {
        this.errorMsg = 'Email o contraseña incorrectos.';
      }
    }
  });
}
}
