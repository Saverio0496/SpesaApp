import { Injectable } from '@angular/core';
import {environment} from "../environments/environments";
import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firebaseConfig: FirebaseOptions = environment.firebase;
  public app = initializeApp(this.firebaseConfig);
  public analytics = getAnalytics(this.app);

  constructor() { }
}
