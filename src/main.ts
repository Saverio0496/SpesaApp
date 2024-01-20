import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import {
//   firebase
// } from 'firebaseui-angular';
import 'firebase/auth';

import { AppModule } from './app/app.module';
import {environment} from "./environments/environments";

// firebase.initializeApp(environment.firebase);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
