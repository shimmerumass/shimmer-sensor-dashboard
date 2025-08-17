import '@angular/compiler';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { Amplify } from 'aws-amplify';
import amplifyConfig from './amplifyconfiguration.json';

Amplify.configure(amplifyConfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err: any) => console.error(err));
