import {Component, OnInit} from '@angular/core';
import {NegozioDTO} from "../../dto/negozioDTO";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ListaSpesaDTO} from "../../dto/listaSpesaDTO";
import {NegozioService} from "../negozio/negozio.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  negozi: NegozioDTO[] = [];
  numeroProdottiDaComprare: { [key: number]: Observable<number> } = {};

  constructor(private router: Router,
              private firestore: AngularFirestore,
              private route: ActivatedRoute,
              private negozioService: NegozioService) {
  }

  ngOnInit(): void {
    this.recuperaNegoziDaDB();
  }

  recuperaNegoziDaDB() {
    this.negozioService.getNegozi().subscribe((negozi: NegozioDTO[]) => {
      this.negozi = negozi;
      this.negozi.forEach(negozio => {
        this.getProdottiDaComprareForNegozio(negozio.id);
      })
    })
  }

  apriNegozio(negozio: NegozioDTO) {
    this.router.navigate([`/negozio/${negozio.id}`], { state: { negozio } });
  }

  getNumeriProdottiDaComprare(negozioId: number | undefined) {
    return this.negozioService.getListaSpesa(negozioId!).pipe(
      map((listaSpesa: ListaSpesaDTO[]) => listaSpesa.filter(item => !item.comprato).length)
    );
  }

  getProdottiDaComprareForNegozio(negozioId: number): void {
    this.numeroProdottiDaComprare[negozioId] = this.getNumeriProdottiDaComprare(negozioId);
  }
}
