import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
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
export class LoginComponent implements OnInit {

  form: FormGroup;
  errorMsg: string = '';
  infoMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');
    if (reason === 'inactivity') {
      this.infoMsg = 'Tu sesión se cerró por inactividad.';
    } else if (reason === 'logout') {
      this.infoMsg = 'Sesión cerrada correctamente.';
    }
    if (this.infoMsg) {
      setTimeout(() => this.infoMsg = '', 5000);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.infoMsg = '';
    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: (resp) => {
        if (resp.mustChangePassword) return;
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
