import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ListaSpesaDTO } from '../../dto/listaSpesaDTO';
import { NegozioDTO } from '../../dto/negozioDTO';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NegozioService {

  constructor(private firestore: AngularFirestore) {}

  getNegozi(): Observable<NegozioDTO[]> {
    return this.firestore.collection('Negozi')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as NegozioDTO;

          return {
            id: Number.parseInt(a.payload.doc.id, 10),
            nome: data.nome
          };
        }))
      );
  }

  getListaSpesa(
    negozioId: number,
    userId: string
  ): Observable<ListaSpesaDTO[]> {

    return this.firestore
      .collection<ListaSpesaDTO>(
        `Negozi/${negozioId}/utenti/${userId}/prodotti`
      )
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({
          ...a.payload.doc.data(),
          id: a.payload.doc.id
        })))
      );
  }

  async salvaListaSpesa(
    negozioId: number,
    listaSpesa: ListaSpesaDTO[],
    userId: string
  ): Promise<void> {

    const prodottiRef = this.firestore.collection<ListaSpesaDTO>(
      `Negozi/${negozioId}/utenti/${userId}/prodotti`
    );

    const snapshot = await firstValueFrom(prodottiRef.get());
    const batch = this.firestore.firestore.batch();

    const idsPresenti = new Set(
      listaSpesa
        .filter(prodotto => !!prodotto.id)
        .map(prodotto => prodotto.id!)
    );

    // Elimina i prodotti rimossi
    snapshot.docs.forEach(doc => {
      if (!idsPresenti.has(doc.id)) {
        batch.delete(doc.ref);
      }
    });

    const nuoviProdotti: { prodotto: ListaSpesaDTO; id: string }[] = [];

    listaSpesa.forEach(prodotto => {

      const dati = {
        nomeProdotto: prodotto.nomeProdotto,
        quantita: prodotto.quantita,
        comprato: prodotto.comprato
      };

      if (prodotto.id) {

        batch.update(prodottiRef.ref.doc(prodotto.id), dati);

      } else {

        const nuovoDoc = prodottiRef.ref.doc();

        batch.set(nuovoDoc, dati);

        nuoviProdotti.push({
          prodotto,
          id: nuovoDoc.id
        });
      }
    });

    await batch.commit();

    // Assegna gli ID soltanto dopo il salvataggio
    nuoviProdotti.forEach(item => {
      item.prodotto.id = item.id;
    });
  }
}
