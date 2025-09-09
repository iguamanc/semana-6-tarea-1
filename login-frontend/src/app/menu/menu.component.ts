import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {

    constructor(private athService: AuthService) {}

    logout() {
        this.athService.logout().subscribe({
            next: (res) => {
                console.log('Logout successful', res);
                window.location.href = '/login'; // Redirect to login page after logout
            },
            error: (err) => {
                console.error('Logout failed', err);
            }
        });
    }
}
