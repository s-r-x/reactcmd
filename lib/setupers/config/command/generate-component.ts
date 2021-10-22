import { injectable } from 'inversify';
import type {
  TCliConfigCmdName,
  TCliConfigFile as TCfg,
} from '../../../typings/config';
import { CfgCmdSetuper } from './abstract';
import {
  COMPONENT_DEFAULT_FILENAME,
  STORIES_DEFAULT_FILENAME,
  TEST_DEFAULT_FILENAME,
} from '../../../generators/component/constants';
import { STYLE_DEFAULT_FILENAME } from '../../../builders/style/constants';
import { AVAILABLE_TEST_LIBS } from '../../../constants/testing';
import type { TTestLib } from '../../../typings/testing';
import type { TStylingStrategy } from '../../../typings/styling';
import {
  AVAILABLE_STYLING_OPTIONS,
  CSS_MODULES_SUPPORTED_STYLINGS,
} from '../../../constants/styling';
import _ from 'lodash';

@injectable()
export class GenerateComponentCmdSetuper extends CfgCmdSetuper<'generateComponent'> {
  protected cmdName: TCliConfigCmdName = 'generateComponent';
  protected async setupCommand(cfg: TCfg) {
    this.setLang(cfg);
    await this.selectComponentFilename(cfg);
    await this.selectStyling(cfg);
    await this.selectTesing(cfg);
    await this.selectStories(cfg);
  }

  private setLang(cfg: TCfg) {
    if (cfg.lang && !this.getField(cfg, 'lang')) {
      this.setField(cfg, 'lang', cfg.lang);
    }
  }
  private async selectStyling(cfg: TCfg) {
    const style = await this.ui.select<TStylingStrategy | 'none'>({
      message: 'Default styling:',
      options: [
        { value: 'none' },
        ...AVAILABLE_STYLING_OPTIONS.map(value => ({
          value,
          name: value === 'sc' ? 'styled-components' : value,
        })),
      ],
      initial: await this.styleAnalyzer.determineStylingStrategy(),
    });
    if (style === 'none') {
      this.setField(cfg, 'ugly', true);
      this.setField(cfg, 'style', undefined);
      return;
    }
    this.setField(cfg, 'style', style);
    if (CSS_MODULES_SUPPORTED_STYLINGS.includes(style)) {
      const useCssModules = await this.ui.confirm({
        message: 'Use CSS modules?',
      });
      this.setField(cfg, 'cssmodules', useCssModules);
    }
    const filename = await this.ui.textInput({
      message: 'Filename of the style(without file extension):',
      initial: STYLE_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    this.setField(cfg, 'stylefile', filename);
  }
  private async selectTesing(cfg: TCfg) {
    const shouldCreatesTest = await this.ui.confirm({
      message: 'Create test suite by default?',
    });
    this.setField(cfg, 'test', shouldCreatesTest);
    if (!shouldCreatesTest) return;
    const testLib = await this.ui.select<TTestLib>({
      message: 'Testing library:',
      initial: await this.testAnalyzer.determineTestLib(),
      options: AVAILABLE_TEST_LIBS.map(value => ({
        value,
        name: value === 'rtl' ? 'React Testing Library' : value,
      })),
    });
    this.setField(cfg, 'testlib', testLib);
    const filename = await this.ui.textInput({
      message: 'Default test filename(without file extension):',
      initial: TEST_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    this.setField(cfg, 'testfile', filename);
  }
  private async selectComponentFilename(cfg: TCfg) {
    const name = await this.ui.textInput({
      message: 'Default component filename(without file extension):',
      initial: COMPONENT_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    this.setField(cfg, 'componentfile', name);
  }
  private async selectStories(cfg: TCfg) {
    const shouldCreateStories = await this.ui.confirm({
      message: 'Create stories by default?',
    });
    this.setField(cfg, 'sb', shouldCreateStories);
    if (!shouldCreateStories) return;
    const filename = await this.ui.textInput({
      message: 'Default stories filename(without file extension):',
      initial: STORIES_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    this.setField(cfg, 'storiesfile', filename);
  }
}
