import { ContainerModule } from 'inversify';
import { ComponentGenInputNormalizer } from '../../normalizers/component-gen-input';
import type { IComponentGenInputNormalizer } from '../../normalizers/component-gen-input/interface';
import { NextPageGenInputNormalizer } from '../../normalizers/next-page-gen-input';
import type { INextPageGenInputNormalizer } from '../../normalizers/next-page-gen-input/interface';
import { TOKENS } from '../tokens';

export const normalizersModule = new ContainerModule(bind => {
  bind<IComponentGenInputNormalizer>(TOKENS.cmpGenInputNrmlz).to(
    ComponentGenInputNormalizer
  );
  bind<INextPageGenInputNormalizer>(TOKENS.nextPageGenInputNrmlz).to(
    NextPageGenInputNormalizer
  );
});
