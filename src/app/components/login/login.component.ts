
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  mostraPassword: boolean = false;
  loginInCorso: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  async login(): Promise<void> {

    if (this.loginInCorso || !this.email.trim() || !this.password) {
      return;
    }

    this.loginInCorso = true;

    try {
      await this.authService.login(
        this.email.trim(),
        this.password
      );

      this.toastr.success('Accesso effettuato con successo');

      await this.router.navigate(['/home']);

    } catch (error) {

      console.error('Errore durante il login:', error);
      this.toastr.error('Email o password non corretti');

    } finally {

      this.loginInCorso = false;

    }
  }
}
