import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {map, Observable} from "rxjs";
import {CanActivate, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.afAuth.user;
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  canActivate(): Observable<boolean> {
    return this.user$.pipe(
      map(user => {
        if (user) {
          return true; // L'utente è autenticato, può accedere alla rotta
        } else {
          this.router.navigate(['/login']);
          return false; // L'utente non è autenticato, lo reindirizziamo alla pagina di login
        }
      })
    );
  }

}
