// O Angular 22 não usa zone.js: cada TestBed roda sem zona
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();
