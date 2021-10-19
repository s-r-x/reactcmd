import { inject, injectable } from 'inversify';
import path from 'path';
import { TOKENS } from '../../ioc/tokens';
import { pascalCase } from '../../utils/pascal-case';
import type { IConfigReader } from '../../readers/config/interface';
import type { IComponentGenInputNormalizer as INormalizer } from './interface';
import type { IEnvAnalyzer } from '../../analyzers/env/interface';
import type { IStylingAnalyzer } from '../../analyzers/styling/interface';
import type { IGenerateComponentOptions as IOptions } from '../../generators/component/interface';

@injectable()
export class ComponentGenInputNormalizer implements INormalizer {
  constructor(
    @inject(TOKENS.envAnalyzer) private envAnalyzer: IEnvAnalyzer,
    @inject(TOKENS.styleAnlz) private styleAnalyzer: IStylingAnalyzer,
    @inject(TOKENS.cfgReader) private cfgReader: IConfigReader
  ) {}
  async normalize(rawInput: IOptions): Promise<IOptions> {
    const input = await this.mergeWithConfig(rawInput);
    this.normalizeComponentName(input);
    await this.normalizeStyle(input);
    await this.normalizeDir(input);
    await this.normalizeLang(input);
    return input;
  }
  async mergeWithConfig(rawInput: IOptions): Promise<IOptions> {
    const cfg = await this.cfgReader.readConfig();
    const input: IOptions = {
      ...cfg?.commands?.component,
      ...rawInput,
    };
    return input;
  }
  async normalizeDir(input: IOptions) {
    const srcDir = await this.envAnalyzer.determineSourceDir();
    if (input.dir) {
      if (!path.isAbsolute(input.dir)) {
        if (input.dir.startsWith('.')) {
          input.dir = path.join(process.cwd(), input.dir);
        } else {
          input.dir = path.join(srcDir, input.dir);
        }
      }
    } else {
      const componentsDir = await this.envAnalyzer.determineComponentsDir();
      if (componentsDir) {
        input.dir = componentsDir;
      } else {
        input.dir = srcDir;
      }
    }
  }
  normalizeComponentName(input: IOptions) {
    input.name = pascalCase(input.name);
  }
  async normalizeStyle(input: IOptions) {
    if (input.nostyle) {
      input.style = undefined;
    }
    if (!input.style && !input.nostyle) {
      input.style = await this.styleAnalyzer.determineStylingStrategy();
    }
  }
  async normalizeLang(input: IOptions) {
    if (!input.js && !input.ts) {
      const lang = await this.envAnalyzer.determineLang();
      input.js = lang === 'js';
      input.ts = lang === 'ts';
    }
  }
}
