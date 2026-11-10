import {Component, OnInit} from '@angular/core';
import {NegozioDTO} from "../../dto/negozioDTO";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListaSpesaDTO} from "../../dto/listaSpesaDTO";
import {NegozioService} from "./negozio.service";
import {ToastrService} from "ngx-toastr";
import firebase from "firebase/compat/app";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-negozio',
  templateUrl: './negozio.component.html',
  styleUrls: ['./negozio.component.css']
})
export class NegozioComponent implements OnInit{

  negozio: NegozioDTO | undefined;
  listaSpesaForm: FormGroup;
  listaSpesa: ListaSpesaDTO[] = [];
  modificheNonSalvate: boolean = false;
  salvataggioInCorso: boolean = false;
  userId: string | undefined;
  prodottoInModifica: number | null = null;
  caricamentoInCorso: boolean = true;
  prodottoTemporaneo: ListaSpesaDTO | null = null;

  constructor(private formBuilder: FormBuilder,
              private negozioService: NegozioService,
              private toastr: ToastrService) {
    this.listaSpesaForm = this.formBuilder.group({
      nomeProdotto: ['', Validators.required],
      quantita: [1, [Validators.required, Validators.min(1)]],
      comprato: [false]
    });
  }

  async ngOnInit(): Promise<void> {

    this.caricamentoInCorso = true;

    try {
      this.userId = firebase.auth().currentUser?.uid;
      this.negozio = history.state.negozio as NegozioDTO;

      if (!this.userId || !this.negozio?.id) {
        throw new Error('Utente o negozio non disponibile');
      }

      this.listaSpesa = await firstValueFrom(
        this.negozioService.getListaSpesa(
          this.negozio.id,
          this.userId
        )
      );

    } catch (error) {
      console.error('Errore caricamento prodotti:', error);
      this.toastr.error('Impossibile caricare la lista della spesa');

    } finally {
      this.caricamentoInCorso = false;
    }
  }

  aggiungiElemento(): void {

    if (
      this.salvataggioInCorso ||
      this.caricamentoInCorso ||
      this.listaSpesaForm.invalid
    ) {
      return;
    }

    const nomeProdotto = String(
      this.listaSpesaForm.value.nomeProdotto || ''
    ).trim().replace(/\s+/g, ' ');

    const quantita = Number(this.listaSpesaForm.value.quantita);

    if (!nomeProdotto || !Number.isInteger(quantita) || quantita < 1) {
      this.toastr.warning('Inserisci un prodotto e una quantità valida');
      return;
    }

    const prodottoEsistente = this.listaSpesa.find(prodotto =>
      this.normalizzaNome(prodotto.nomeProdotto) ===
      this.normalizzaNome(nomeProdotto)
    );

    if (prodottoEsistente) {

      prodottoEsistente.quantita =
        Number(prodottoEsistente.quantita) + quantita;

      prodottoEsistente.comprato = false;

      this.toastr.info('Prodotto già presente, quantità aggiornata');

    } else {

      this.listaSpesa.push({
        nomeProdotto,
        quantita,
        comprato: false
      });

      this.toastr.success('Prodotto aggiunto alla lista');
    }

    this.modificheNonSalvate = true;

    this.listaSpesaForm.reset({
      nomeProdotto: '',
      quantita: 1,
      comprato: false
    });
  }

  toggleStatoElemento(index: number) {
    if (this.salvataggioInCorso) {
      return;
    }

    this.listaSpesa[index].comprato = !this.listaSpesa[index].comprato;
    this.modificheNonSalvate = true;
  }

  toggleModifica(index: number): void {

    if (this.salvataggioInCorso || this.caricamentoInCorso) {
      return;
    }

    if (this.prodottoInModifica === index) {
      this.prodottoInModifica = null;
      this.prodottoTemporaneo = null;
      return;
    }

    this.prodottoInModifica = index;

    this.prodottoTemporaneo = {
      ...this.listaSpesa[index]
    };
  }

  confermaModificaProdotto(index: number): void {

    if (
      this.salvataggioInCorso ||
      this.caricamentoInCorso ||
      !this.prodottoTemporaneo
    ) {
      return;
    }

    const nome = String(
      this.prodottoTemporaneo.nomeProdotto || ''
    ).trim().replace(/\s+/g, ' ');

    const quantita = Number(this.prodottoTemporaneo.quantita);

    if (!nome || !Number.isInteger(quantita) || quantita < 1) {
      this.toastr.warning('Inserisci un nome e una quantità valida');
      return;
    }

    const duplicato = this.listaSpesa.some((prodotto, i) =>
      i !== index &&
      this.normalizzaNome(prodotto.nomeProdotto) ===
      this.normalizzaNome(nome)
    );

    if (duplicato) {
      this.toastr.warning('Esiste già un prodotto con questo nome');
      return;
    }

    this.listaSpesa[index] = {
      ...this.listaSpesa[index],
      nomeProdotto: nome,
      quantita
    };

    this.modificheNonSalvate = true;
    this.prodottoInModifica = null;
    this.prodottoTemporaneo = null;

    this.toastr.info('Modifica confermata. Ricorda di salvare la lista');
  }

  rimuoviElemento(index: number) {
    if (this.salvataggioInCorso) {
      return;
    }

    this.listaSpesa.splice(index, 1);
    this.prodottoInModifica = null;
    this.modificheNonSalvate = true;
  }

  async salvaModifiche(): Promise<void> {

    if (
      !this.modificheNonSalvate ||
      this.salvataggioInCorso ||
      this.caricamentoInCorso
    ) {
      return;
    }

    if (this.prodottoInModifica !== null) {
      this.toastr.warning('Conferma prima la modifica del prodotto');
      return;
    }

    if (!this.negozio?.id || !this.userId) {
      this.toastr.error('Utente o negozio non disponibile');
      return;
    }

    const prodottiValidi = this.listaSpesa.every(prodotto =>
      !!this.normalizzaNome(prodotto.nomeProdotto) &&
      Number.isInteger(Number(prodotto.quantita)) &&
      Number(prodotto.quantita) >= 1
    );

    if (!prodottiValidi) {
      this.toastr.warning('Controlla i prodotti prima di salvare');
      return;
    }

    this.salvataggioInCorso = true;

    try {

      await this.negozioService.salvaListaSpesa(
        this.negozio.id,
        this.listaSpesa,
        this.userId
      );

      this.modificheNonSalvate = false;
      this.toastr.success('Modifiche salvate correttamente');

    } catch (error) {

      console.error('Errore salvataggio:', error);
      this.toastr.error('Errore durante il salvataggio');

    } finally {

      this.salvataggioInCorso = false;
    }
  }

  private normalizzaNome(nome: string): string {
    return (nome || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }
}
