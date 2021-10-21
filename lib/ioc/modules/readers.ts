import { ContainerModule } from 'inversify';
import { styleBuilderFactory } from '../../builders/style/factory';
import type { TStyleBuilderFactory } from '../../builders/style/interface';
import { CodeFormatterConfigReader } from '../../readers/code-formatter-config';
import type { ICodeFormatterConfigReader } from '../../readers/code-formatter-config/interface';
import { ConfigReader } from '../../readers/config';
import type { IConfigReader } from '../../readers/config/interface';
import { DepsReader } from '../../readers/deps';
import type { IDepsReader } from '../../readers/deps/interface';
import { EnvReader } from '../../readers/env';
import type { IEnvReader } from '../../readers/env/interface';
import { PkgJsonReader } from '../../readers/pkg-json';
import type { IPkgJsonReader } from '../../readers/pkg-json/interface';
import { TOKENS } from '../tokens';

export const readersModule = new ContainerModule(bind => {
  bind<TStyleBuilderFactory>(TOKENS.styBldrFctry).toConstantValue(
    styleBuilderFactory
  );
  bind<IConfigReader>(TOKENS.cfgReader).to(ConfigReader).inSingletonScope();
  bind<IEnvReader>(TOKENS.env).to(EnvReader).inSingletonScope();
  bind<ICodeFormatterConfigReader>(TOKENS.codeFormatterCfgReader)
    .to(CodeFormatterConfigReader)
    .inSingletonScope();
  bind<IDepsReader>(TOKENS.depsReader).to(DepsReader).inSingletonScope();
  bind<IPkgJsonReader>(TOKENS.pkgJsonReader)
    .to(PkgJsonReader)
    .inSingletonScope();
});
