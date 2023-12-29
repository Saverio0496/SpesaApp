import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NegozioDTO} from "../../dto/negozioDTO";
import {map} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListaSpesaDTO} from "../../dto/listaSpesaDTO";

@Component({
  selector: 'app-negozio',
  templateUrl: './negozio.component.html',
  styleUrls: ['./negozio.component.css']
})
export class NegozioComponent implements OnInit{

  negozio: NegozioDTO | undefined;
  listaSpesaForm: FormGroup;
  listaSpesa: ListaSpesaDTO[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.listaSpesaForm = this.formBuilder.group({
      nomeProdotto: ['', Validators.required],
      quantita: [1, Validators.min(1)]
    });
  }

  ngOnInit(): void {
    this.negozio = history.state.negozio as NegozioDTO;
  }

  aggiungiElemento() {
    if (this.listaSpesaForm.valid) {
      const nomeProdotto = this.listaSpesaForm.value.nomeProdotto;
      const quantita = this.listaSpesaForm.value.quantita;

      // Adesso puoi utilizzare questi valori come preferisci,
      // ad esempio, puoi stamparli in console per simulare l'aggiunta alla lista della spesa
      console.log('Nome Prodotto:', nomeProdotto);
      console.log('Quantità:', quantita);

      const oggettoDaAggiungere: ListaSpesaDTO = {
        nomeProdotto: nomeProdotto,
        quantita: quantita
      }
      // Aggiungi l'elemento alla lista della spesa
      this.listaSpesa.push(oggettoDaAggiungere);

      // Resetta i campi di input dopo l'aggiunta
      this.listaSpesaForm.reset();

    }
  }

}
