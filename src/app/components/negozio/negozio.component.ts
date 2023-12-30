import {Component, OnInit} from '@angular/core';
import {NegozioDTO} from "../../dto/negozioDTO";
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
  numeroProdottiDaComprare: number = 0;

  constructor(private formBuilder: FormBuilder) {
    this.listaSpesaForm = this.formBuilder.group({
      nomeProdotto: ['', Validators.required],
      quantita: [1, Validators.required],
      comprato: [false]
    });
  }

  ngOnInit(): void {
    this.negozio = history.state.negozio as NegozioDTO;
    this.numeroProdottiDaComprare = this.listaSpesa.filter(item => !item.comprato).length;
  }

  aggiungiElemento() {
    if (this.listaSpesaForm.valid) {
      const nomeProdotto = this.listaSpesaForm.value.nomeProdotto;
      const quantita = this.listaSpesaForm.value.quantita;

      const oggettoDaAggiungere: ListaSpesaDTO = {
        nomeProdotto: nomeProdotto,
        quantita: quantita,
        comprato: false
      }
      // Aggiungi l'elemento alla lista della spesa
      this.listaSpesa.push(oggettoDaAggiungere);

      // Resetta i campi di input dopo l'aggiunta
      this.listaSpesaForm.reset();
      this.listaSpesaForm.get('quantita')?.setValue(1);

      this.numeroProdottiDaComprare = this.listaSpesa.filter(item => !item.comprato).length;

    }
  }

  toggleStatoElemento(index: number) {
    this.listaSpesa[index].comprato = !this.listaSpesa[index].comprato;
    this.numeroProdottiDaComprare = this.listaSpesa.filter(item => !item.comprato).length;
  }

  rimuoviElemento(index: number) {
    this.listaSpesa.splice(index, 1);
    this.numeroProdottiDaComprare = this.listaSpesa.filter(item => !item.comprato).length;
  }

}
