import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from "./menu/menu.component";
import { AuthService } from './Services/auth.service';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Solofront';
   showMenu = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const isLogin = event.url === '/login';
        this.showMenu = !isLogin && this.authService.isLoggedIn();
      });

    // Actualizar menú si cambia estado de login
    this.authService.isLoggedIn$.subscribe(() => {
      const currentUrl = this.router.url;
      const isLogin = currentUrl === '/login';
      this.showMenu = !isLogin && this.authService.isLoggedIn();
    });
  }
}