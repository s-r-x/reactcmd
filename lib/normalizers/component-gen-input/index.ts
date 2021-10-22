import { inject, injectable } from 'inversify';
import path from 'path';
import { TOKENS } from '../../ioc/tokens';
import { pascalCase } from '../../utils/pascal-case';
import type { IComponentGenInputNormalizer as INormalizer } from './interface';
import type { IEnvAnalyzer } from '../../analyzers/env/interface';
import type { IStylingAnalyzer } from '../../analyzers/styling/interface';
import type { IGenerateComponentOptions as IOptions } from '../../generators/component/interface';
import type { ITestingAnalyzer } from '../../analyzers/testing/interface';
import { removeSpaces } from '../../utils/remove-spaces';

@injectable()
export class ComponentGenInputNormalizer implements INormalizer {
  constructor(
    @inject(TOKENS.envAnalyzer) private envAnalyzer: IEnvAnalyzer,
    @inject(TOKENS.styleAnlz) private styleAnalyzer: IStylingAnalyzer,
    @inject(TOKENS.testAnlz) private testAnalyzer: ITestingAnalyzer
  ) {}
  async normalize(rawInput: IOptions): Promise<IOptions> {
    const input = await { ...rawInput };
    this.normalizeComponentName(input);
    this.normalizePaths(input);
    await this.normalizeStyle(input);
    await this.normalizeDir(input);
    await this.normalizeLang(input);
    return input;
  }
  normalizePaths(input: IOptions) {
    input.testfile = input.testfile!.trim();
    input.stylefile = input.stylefile!.trim();
    input.storiesfile = input.storiesfile!.trim();
    input.componentfile = input.componentfile!.trim();
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
    input.name = removeSpaces(pascalCase(input.name));
  }
  async normalizeTesting(input: IOptions) {
    if (input.test) {
      if (!input.testlib) {
        input.testlib = await this.testAnalyzer.determineTestLib();
      }
      if (!input.testrunner) {
        input.testrunner = await this.testAnalyzer.determineTestRunner();
      }
    }
  }
  async normalizeStyle(input: IOptions) {
    if (input.ugly) {
      input.style = undefined;
    }
    if (!input.style && !input.ugly) {
      input.style = await this.styleAnalyzer.determineStylingStrategy();
    }
  }
  async normalizeLang(input: IOptions) {
    if (!input.lang) {
      input.lang = await this.envAnalyzer.determineLang();
    }
  }
}
