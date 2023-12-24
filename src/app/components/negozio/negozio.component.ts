import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NegozioDTO} from "../../dto/negozioDTO";
import {map} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-negozio',
  templateUrl: './negozio.component.html',
  styleUrls: ['./negozio.component.css']
})
export class NegozioComponent implements OnInit{

  negozio: NegozioDTO | undefined;

  constructor() {
  }

  ngOnInit(): void {
    this.negozio = history.state.negozio as NegozioDTO;
  }

}
