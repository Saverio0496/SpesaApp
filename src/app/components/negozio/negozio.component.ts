import {Component, OnInit} from '@angular/core';
import {NegozioDTO} from "../../dto/negozioDTO";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListaSpesaDTO} from "../../dto/listaSpesaDTO";
import {NegozioService} from "./negozio.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../login/auth.service";
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

  constructor(private formBuilder: FormBuilder,
              private negozioService: NegozioService,
              private toastr: ToastrService) {
    this.listaSpesaForm = this.formBuilder.group({
      nomeProdotto: ['', Validators.required],
      quantita: [1, Validators.required],
      comprato: [false]
    });
    this.userId = firebase.auth().currentUser?.uid;
    this.negozio = history.state.negozio as NegozioDTO;
    firstValueFrom(
      this.negozioService.getListaSpesa(
        this.negozio!.id,
        this.userId!
      )
    ).then(listaSpesa => {
      this.listaSpesa = listaSpesa;
    }).catch(error => {
      console.error('Errore caricamento prodotti:', error);
      this.toastr.error('Errore durante il caricamento della lista');
    });
  }

  ngOnInit(): void {

  }

  aggiungiElemento() {
    if (this.salvataggioInCorso || this.listaSpesaForm.invalid) {
      return;
    }

    const oggettoDaAggiungere: ListaSpesaDTO = {
      nomeProdotto: this.listaSpesaForm.value.nomeProdotto,
      quantita: this.listaSpesaForm.value.quantita,
      comprato: false
    };

    this.listaSpesa.push(oggettoDaAggiungere);

    this.modificheNonSalvate = true;

    this.listaSpesaForm.reset({
      nomeProdotto: '',
      quantita: 1,
      comprato: false
    });

    this.toastr.success('Prodotto aggiunto alla lista');
  }

  toggleStatoElemento(index: number) {
    if (this.salvataggioInCorso) {
      return;
    }

    this.listaSpesa[index].comprato = !this.listaSpesa[index].comprato;
    this.modificheNonSalvate = true;
  }

  rimuoviElemento(index: number) {
    if (this.salvataggioInCorso) {
      return;
    }

    this.listaSpesa.splice(index, 1);
    this.modificheNonSalvate = true;
  }

  async salvaModifiche() {

    if (!this.modificheNonSalvate || this.salvataggioInCorso) {
      return;
    }

    this.salvataggioInCorso = true;

    try {

      await this.negozioService.salvaListaSpesa(
        this.negozio!.id,
        this.listaSpesa,
        this.userId!
      );

      this.modificheNonSalvate = false;
      this.toastr.success('Modifiche salvate correttamente');

    } catch (error) {

      console.error(error);
      this.toastr.error('Errore durante il salvataggio');

    } finally {

      this.salvataggioInCorso = false;

    }
  }

  salvaModificheProdotto(negozioId: number, indexProdotto: number) {

    if (this.salvataggioInCorso) {
      return;
    }

    // Il prodotto è già stato modificato nell'array locale
    this.modificheNonSalvate = true;

    this.toastr.info('Modifica effettuata. Premi Salva modifiche per confermare.');
  }
}
