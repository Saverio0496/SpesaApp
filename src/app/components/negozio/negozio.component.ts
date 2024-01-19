import {Component, OnInit} from '@angular/core';
import {NegozioDTO} from "../../dto/negozioDTO";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListaSpesaDTO} from "../../dto/listaSpesaDTO";
import {NegozioService} from "./negozio.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../login/auth.service";
import {user} from "@angular/fire/auth";
import {AngularFireAuth} from "@angular/fire/compat/auth";

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
  userId: string | undefined;

  constructor(private formBuilder: FormBuilder,
              private negozioService: NegozioService,
              private toastr: ToastrService,
              private afAuth: AngularFireAuth) {
    this.listaSpesaForm = this.formBuilder.group({
      nomeProdotto: ['', Validators.required],
      quantita: [1, Validators.required],
      comprato: [false]
    });
    this.afAuth.user.subscribe(res => this.userId = res?.uid);
  }

  ngOnInit(): void {
    this.negozio = history.state.negozio as NegozioDTO;
    this.negozioService.getListaSpesa(this.negozio.id).subscribe((listaSpesa: ListaSpesaDTO[]) => {
      this.listaSpesa = listaSpesa;
    });
  }

  aggiungiElemento() {
    if (this.listaSpesaForm.valid) {
      const nomeProdotto = this.listaSpesaForm.value.nomeProdotto;
      const quantita = this.listaSpesaForm.value.quantita;

      const oggettoDaAggiungere: ListaSpesaDTO = {
        nomeProdotto: nomeProdotto,
        quantita: quantita,
        comprato: false,
        userId: this.userId!
      }
      // Aggiungi l'elemento alla lista della spesa
      this.negozioService.aggiungiProdotto(this.negozio?.id!, oggettoDaAggiungere).then(() => {
        this.toastr.success("Elemento aggiunto alla lista della spesa");
        this.listaSpesa.push(oggettoDaAggiungere);
        this.listaSpesaForm.reset();
        this.listaSpesaForm.get('quantita')?.setValue(1);
      }).catch(error => {
        this.toastr.error('Errore durante l\'aggiunta del prodotto');
        // Gestione degli errori durante l'aggiunta di un prodotto
        console.error('Errore durante l\'aggiunta del prodotto:', error);
      });
    }
    this.modificheNonSalvate = true;
  }

  toggleStatoElemento(index: number) {
    this.listaSpesa[index].comprato = !this.listaSpesa[index].comprato;
    this.modificheNonSalvate = true;
  }

  rimuoviElemento(index: number) {
    this.listaSpesa.splice(index, 1);
    this.modificheNonSalvate = true;
  }

  salvaModifiche() {
    if (this.modificheNonSalvate) {
      // Salva la lista della spesa solo se ci sono modifiche non salvate
      this.negozioService.salvaListaSpesa(this.negozio?.id!, this.listaSpesa).then(() => {
        this.toastr.success('Modifiche salvate correttamente');
        // Operazioni aggiuntive dopo il salvataggio
        this.modificheNonSalvate = false; // Resetta il flag dopo il salvataggio
      })
        .catch(error => {
          this.toastr.error('Errore durante il salvataggio');
          // Gestione degli errori durante il salvataggio
          console.error('Errore durante il salvataggio:', error);
        });
    }
  }

  salvaModificheProdotto(negozioId: number, indexProdotto: number) {
    // Puoi inserire qui la logica per salvare le modifiche nel backend
    this.negozioService.salvaModificaProdottoListaSpesa(negozioId, indexProdotto, this.listaSpesa[indexProdotto]).then(() => {
      this.toastr.success('Modifiche salvate correttamente');
      this.negozioService.getListaSpesa(negozioId).subscribe((listaSpesa: ListaSpesaDTO[]) => {
        this.listaSpesa = listaSpesa;
      })
    })

  }
}
