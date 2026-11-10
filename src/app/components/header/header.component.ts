import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  @Input() titolo: string | undefined;
  @Input() nomePerLogo: string | undefined;
  @Input() funzionalitaHome: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  async logout(): Promise<void> {
    try {
      await firebase.auth().signOut();

      await this.router.navigate(['/login'], {
        replaceUrl: true
      });

    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }

  tornaHome() {
    this.router.navigate([`/home`]);
  }
}
