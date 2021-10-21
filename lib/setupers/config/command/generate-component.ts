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
    await this.selectStyling(cfg);
    await this.selectTestLib(cfg);
    await this.selectComponentFilename(cfg);
    await this.selectStyleFilename(cfg);
    await this.selectSbFilename(cfg);
    await this.selectTestFilename(cfg);
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
}
