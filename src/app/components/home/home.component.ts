import {Component, OnInit} from '@angular/core';
import {NegozioDTO} from "../../dto/negozioDTO";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ListaSpesaDTO} from "../../dto/listaSpesaDTO";
import {NegozioService} from "../negozio/negozio.service";
import {map, Observable} from "rxjs";
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  negozi: NegozioDTO[] = [];
  numeroProdottiDaComprare: { [key: number]: Observable<number> } = {};
  userId: string | undefined;

  constructor(private router: Router,
              private firestore: AngularFirestore,
              private route: ActivatedRoute,
              private negozioService: NegozioService) {
    this.userId = firebase.auth().currentUser?.uid;
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
    return this.negozioService.getListaSpesa(negozioId!, this.userId!).pipe(
      map((listaSpesa: ListaSpesaDTO[]) => listaSpesa.filter(item => !item.comprato).length)
    );
  }

  getProdottiDaComprareForNegozio(negozioId: number): void {
    this.numeroProdottiDaComprare[negozioId] = this.getNumeriProdottiDaComprare(negozioId);
  }
}
