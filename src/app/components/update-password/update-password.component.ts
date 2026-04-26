import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../core/service/usuario.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent {

  form: FormGroup;
  errorMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      passwordActual: ['', Validators.required],
      passwordNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { passwordActual, passwordNueva, confirmar } = this.form.value;

    if (passwordNueva !== confirmar) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.usuarioService.cambiarPassword({ passwordActual, passwordNueva }).subscribe({
      next: () => {
        // Actualizar el estado en memoria para quitar mustChangePassword
        const usuario = this.authService.getUsuario();
        if (usuario) usuario.mustChangePassword = false;

        // Todos los usuarios van al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error?.mensaje || 'Error al cambiar la contraseña';
        this.loading = false;
      }
    });
  }
}
