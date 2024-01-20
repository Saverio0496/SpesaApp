import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  // ui: firebaseui.auth.AuthUI;

  constructor(private authService: AuthService,
              private router: Router,
              private toastr: ToastrService) {
    // const uiConfig = {
    //   signInSuccessUrl: '/home',
    //   signInOptions: [
    //     firebase.auth.EmailAuthProvider.PROVIDER_ID
    //   ],
      // tosUrl: '/terms-of-service',
      // privacyPolicyUrl: '/privacy-policy',
    // };

    // this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    //
    // this.ui.start('#firebaseui-auth-container', uiConfig);
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    // this.ui.delete();
  }

  login() {
    this.authService.login(this.email, this.password)
      .then(response => {
        this.toastr.success("Accesso effettuato con successo");
        this.router.navigate(['/home']); // Naviga verso la home dopo il login
      })
      .catch(error => {
        this.toastr.error("Errore durante l\'accesso");
      });
  }
}
