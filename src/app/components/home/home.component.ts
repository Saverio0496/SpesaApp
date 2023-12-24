import {Component, OnInit} from '@angular/core';
import {NegozioDTO} from "../../dto/negozioDTO";
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  negozi: NegozioDTO[] = [];

  constructor(private router: Router,
              private firestore: AngularFirestore) {
  }

  ngOnInit(): void {
    this.recuperaNegoziDaDB();
  }

  recuperaNegoziDaDB() {
    this.firestore.collection('Negozi')
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as NegozioDTO;
            const id = a.payload.doc.id;
            const negozioDTO: NegozioDTO = {
              id: Number.parseInt(id),
              nome: data.nome
            };
            return negozioDTO;
          });
        })
      )
      .subscribe((negozi: NegozioDTO[]) => {
        this.negozi = negozi;
      });
  }

  apriNegozio(negozio: NegozioDTO) {
    this.router.navigate([`/negozio/${negozio.id}`], { state: { negozio } });
  }

}
