import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ListaSpesaDTO} from "../../dto/listaSpesaDTO";
import {map, Observable} from "rxjs";
import {NegozioDTO} from "../../dto/negozioDTO";

@Injectable({
  providedIn: 'root'
})
export class NegozioService {

  constructor(private firestore: AngularFirestore) { }

  getNegozi(): Observable<any> {
    return this.firestore.collection('Negozi')
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
  }

  getListaSpesa(negozioId: number): Observable<any> {
    const listaSpesaRef = this.firestore.collection(`Negozi/${negozioId}/listaSpesa`).doc('prodotti').collection('prodotti');

    return listaSpesaRef.valueChanges();
  }

  aggiungiProdotto(negozioId: number, prodotto: ListaSpesaDTO): Promise<void> {
    const listaSpesaRef = this.firestore.collection(`Negozi/${negozioId}/listaSpesa`).doc('prodotti');

    listaSpesaRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        // Se la sottocollezione 'listaSpesa' esiste, aggiungi il prodotto a 'prodotti'
        listaSpesaRef.collection('prodotti').add(prodotto);
      } else {
        // Se la sottocollezione 'listaSpesa' non esiste, creala e aggiungi il primo prodotto
        listaSpesaRef.set({}).then(() => {
          listaSpesaRef.collection('prodotti').add(prodotto);
        });
      }
    });

    return Promise.resolve();
  }

  salvaListaSpesa(negozioId: number, listaSpesa: ListaSpesaDTO[]): Promise<void> {
    const listaSpesaRef = this.firestore.collection(`Negozi/${negozioId}/listaSpesa`).doc('prodotti');

    listaSpesaRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        // Se la sottocollezione esiste, svuotiamola prima di aggiungere gli elementi aggiornati
        listaSpesaRef.collection('prodotti').get().subscribe(snapshot => {
          snapshot.forEach(doc => {
            doc.ref.delete();
          });
        });
      } else {
        // Se la sottocollezione non esiste, la creiamo
        listaSpesaRef.collection('prodotti').add({}); // Creiamo un documento vuoto per la sottocollezione
      }

      // Aggiungiamo ogni prodotto come documento separato nella sottocollezione
      listaSpesa.forEach(prodotto => {
        listaSpesaRef.collection('prodotti').add(prodotto);
      });
    });
    return Promise.resolve();
  }

  salvaModificaProdottoListaSpesa(negozioId: number, indexProdotto: number, elemento: ListaSpesaDTO): Promise<void> {
    const listaSpesaRef = this.firestore.collection(`Negozi/${negozioId}/listaSpesa`).doc('prodotti');

    // Effettua una query per trovare il documento che corrisponde alle proprietà dell'elemento
    listaSpesaRef.collection('prodotti').get().subscribe(querySnapshot => {
      querySnapshot.docs[indexProdotto].ref.update(elemento);
    })

    return Promise.resolve();
  }
}
