import { ContainerModule } from 'inversify';
import { EnvAnalyzer } from '../../analyzers/env';
import type { IEnvAnalyzer } from '../../analyzers/env/interface';
import { StylingAnalyzer } from '../../analyzers/styling';
import type { IStylingAnalyzer } from '../../analyzers/styling/interface';
import { TestingAnalyzer } from '../../analyzers/testing';
import type { ITestingAnalyzer } from '../../analyzers/testing/interface';
import { TOKENS } from '../tokens';

export const analyzersModule = new ContainerModule(bind => {
  bind<IEnvAnalyzer>(TOKENS.envAnalyzer).to(EnvAnalyzer).inSingletonScope();
  bind<ITestingAnalyzer>(TOKENS.testAnlz)
    .to(TestingAnalyzer)
    .inSingletonScope();
  bind<IStylingAnalyzer>(TOKENS.styleAnlz)
    .to(StylingAnalyzer)
    .inSingletonScope();
});
