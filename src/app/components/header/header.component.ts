import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  @Input() titolo: string | undefined;
  @Input() nomePerLogo: string | undefined;
  @Input() funzionalitaHome: boolean = false;
  @Input() numeroProdottiDaComprare: number = 0;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  tornaHome(prodottiDaComprare: number) {
    this.router.navigate([`/home`], { state: { prodottiDaComprare } });
  }
}
