import { analyzersModule } from './analyzers';
import { writersModule } from './writers';
import { readersModule } from './readers';
import { buildersModule } from './builders';
import { generatorsModule } from './generators';
import { setupersModule } from './setupers';

export const modules = [
  analyzersModule,
  writersModule,
  readersModule,
  buildersModule,
  generatorsModule,
  setupersModule,
];
