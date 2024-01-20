import {Injectable} from '@angular/core';
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

  getListaSpesa(negozioId: number, userId: string): Observable<any> {
    const listaSpesaRef = this.firestore.collection(`Negozi/${negozioId}/listaSpesa`).doc('prodotti').collection(userId);

    return listaSpesaRef.valueChanges();
  }


  aggiungiProdotto(negozioId: number, prodotto: ListaSpesaDTO, userId: string): Promise<void> {
    const listaSpesaRef = this.firestore.collection(`Negozi/${negozioId}/listaSpesa`).doc('prodotti');

    listaSpesaRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        // Se la sottocollezione 'listaSpesa' esiste, aggiungi il prodotto a 'prodotti'
        listaSpesaRef.collection(userId).add(prodotto);
      } else {
        // Se la sottocollezione 'listaSpesa' non esiste, creala e aggiungi il primo prodotto
        listaSpesaRef.set({}).then(() => {
          listaSpesaRef.collection(userId).add(prodotto);

        });
      }
    });

    return Promise.resolve();
  }

  salvaListaSpesa(negozioId: number, listaSpesa: ListaSpesaDTO[], userId: string): Promise<void> {
    const listaSpesaRef = this.firestore.collection(`Negozi/${negozioId}/listaSpesa`).doc('prodotti');

    listaSpesaRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        // Se la sottocollezione esiste, svuotiamola prima di aggiungere gli elementi aggiornati
        listaSpesaRef.collection(userId).get().subscribe(snapshot => {
          snapshot.forEach(doc => {
            doc.ref.delete();
          });
        });
      } else {
        // Se la sottocollezione non esiste, la creiamo
        listaSpesaRef.collection(userId).add({}); // Creiamo un documento vuoto per la sottocollezione
      }

      // Aggiungiamo ogni prodotto come documento separato nella sottocollezione
      listaSpesa.forEach(prodotto => {
        // Utilizza l'userID come identificatore univoco per ogni elemento della lista
        listaSpesaRef.collection(userId).add(prodotto);
      });
    });

    return Promise.resolve();
  }

  salvaModificaProdottoListaSpesa(negozioId: number, indexProdotto: number, elemento: ListaSpesaDTO, userId: string): Promise<void> {
    const listaSpesaRef = this.firestore.collection(`Negozi/${negozioId}/listaSpesa`).doc('prodotti');

    // Effettua una query per trovare il documento che corrisponde alle proprietà dell'elemento
    listaSpesaRef.collection(userId).get().subscribe(querySnapshot => {
      querySnapshot.docs[indexProdotto].ref.update(elemento);
    })

    return Promise.resolve();
  }
}
