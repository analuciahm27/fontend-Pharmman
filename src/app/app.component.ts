import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/service/auth.service';
import { environment } from '../enviroments/enviroment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Pharmman-front';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(user => {
      if (user) {
        console.log('Sesión activa detectada para:', user.nombre);
      } else {
        console.log('No hay sesión de usuario activa.');
      }
    });
  }

  // Al cerrar la pestaña o el navegador, registrar la salida
  // sendBeacon garantiza que la petición se envíe aunque la página se esté cerrando
  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    if (this.authService.isLoggedIn()) {
      navigator.sendBeacon(`${environment.apiUrl}/auth/logout`);
    }
  }
}