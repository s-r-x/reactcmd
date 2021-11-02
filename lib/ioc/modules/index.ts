import { analyzersModule } from './analyzers';
import { writersModule } from './writers';
import { readersModule } from './readers';
import { buildersModule } from './builders';
import { generatorsModule } from './generators';
import { setupersModule } from './setupers';
import { normalizersModule } from './normalizers';

export const modules = [
  analyzersModule,
  normalizersModule,
  writersModule,
  readersModule,
  buildersModule,
  generatorsModule,
  setupersModule,
];
