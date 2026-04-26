import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ProductoComponent } from './components/producto/producto.component';
import { VentasComponent } from './components/venta/venta.component';
import { SesionesComponent } from './components/sesion/sesion.component';
import { IngresoComponent } from './components/ingreso/ingreso.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },
  { path: 'productos', component: ProductoComponent, canActivate: [authGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [authGuard] },
  { path: 'ventas/registro', component: VentasComponent, canActivate: [authGuard] },
  { path: 'ingresos', component: IngresoComponent, canActivate: [authGuard] },
  { path: 'sesiones', component: SesionesComponent, canActivate: [authGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
