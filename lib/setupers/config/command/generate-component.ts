import { injectable } from 'inversify';
import type { TCliConfigFile as TBaseCfg } from '../../../typings/config';
import { CfgCmdSetuper } from './abstract';
import {
  COMPONENT_DEFAULT_FILENAME,
  STORIES_DEFAULT_FILENAME,
  TEST_DEFAULT_FILENAME,
} from '../../../generators/component/constants';
import { STYLE_DEFAULT_FILENAME } from '../../../builders/style/constants';
import { AVAILABLE_TEST_LIBS } from '../../../constants/testing';
import type { TTestLib } from '../../../typings/testing';
import { TStylingStrategy } from '../../../typings/styling';
import {
  AVAILABLE_STYLING_OPTIONS,
  CSS_MODULES_SUPPORTED_STYLINGS,
} from '../../../constants/styling';
import _ from 'lodash';

type TCfg = NonNullable<NonNullable<TBaseCfg['commands']>['generateComponent']>;

@injectable()
export class GenerateComponentCmdSetuper extends CfgCmdSetuper {
  protected cmdNestedPropPath = 'generate.component';
  private readonly cfgPropPath = 'commands.generate.component';
  async setup(cfg: TBaseCfg) {
    this.normalizeIncomingConfig(cfg);
    const cmdConfig: TCfg = _.get(cfg, this.cfgPropPath);
    await this.selectStyling(cmdConfig);
    await this.selectTestLib(cmdConfig);
    await this.selectComponentFilename(cmdConfig);
    await this.selectStyleFilename(cmdConfig);
    await this.selectSbFilename(cmdConfig);
    await this.selectTestFilename(cmdConfig);
  }

  private async selectStyling(cfg: TCfg) {
    const initial = await this.styleAnalyzer.determineStylingStrategy();
    const style = await this.ui.select<TStylingStrategy>({
      message: 'Styling:',
      options: AVAILABLE_STYLING_OPTIONS.map(value => ({
        value,
        name: value === 'sc' ? 'styled-components' : value,
      })),
      initial,
    });
    this.setField(cfg, 'style', style);
    if (CSS_MODULES_SUPPORTED_STYLINGS.includes(style)) {
      const useCssModules = await this.ui.confirm({
        message: 'Use CSS modules?',
        initial: true,
      });
      this.setField(cfg, 'cssmodules', useCssModules);
    }
  }
  private async selectTestLib(cfg: TCfg) {
    const initial = await this.testAnalyzer.determineTestLib();
    const testLib = await this.ui.select<TTestLib>({
      message: 'Testing library:',
      initial,
      options: AVAILABLE_TEST_LIBS.map(value => ({
        value,
        name: value === 'rtl' ? 'React Testing Library' : value,
      })),
    });
    this.setField(cfg, 'testlib', testLib);
  }
  private async selectComponentFilename(cfg: TCfg) {
    const name = await this.ui.textInput({
      message: 'Filename of the component(without file extension):',
      initial: COMPONENT_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    this.setField(cfg, 'componentfile', name);
  }
  private async selectStyleFilename(cfg: TCfg) {
    const name = await this.ui.textInput({
      message: 'Filename of the style(without file extension):',
      initial: STYLE_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    this.setField(cfg, 'stylefile', name);
  }
  private async selectTestFilename(cfg: TCfg) {
    const name = await this.ui.textInput({
      message: 'Filename of the test(without file extension):',
      initial: TEST_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    this.setField(cfg, 'testfile', name);
  }
  private async selectSbFilename(cfg: TCfg) {
    const name = await this.ui.textInput({
      message: 'Filename of the stories(without file extension):',
      initial: STORIES_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    this.setField(cfg, 'storiesfile', name);
  }
  private setField<T extends keyof TCfg>(cfg: TCfg, key: T, value: TCfg[T]) {
    cfg[key] = value;
  }
}
