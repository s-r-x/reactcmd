import { injectable } from 'inversify';
import type { TCliConfigFile } from '../../../typings/config';
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

@injectable()
export class GenerateComponentCmdSetuper extends CfgCmdSetuper {
  async setup(cfg: TCliConfigFile) {
    await this.selectStyling();
    await this.selectTestLib();
    await this.selectComponentFilename();
    await this.selectStyleFilename();
    await this.selectSbFilename();
    await this.selectTestFilename();
    return cfg;
  }

  private async selectStyling() {
    const initial = await this.styleAnalyzer.determineStylingStrategy();
    const style = await this.ui.select<TStylingStrategy>({
      message: 'Styling:',
      options: AVAILABLE_STYLING_OPTIONS.map(value => ({
        value,
        name: value === 'sc' ? 'styled-components' : value,
      })),
      initial,
    });
    console.log(style);
    if (CSS_MODULES_SUPPORTED_STYLINGS.includes(style)) {
      const useCssModules = await this.ui.confirm({
        message: 'Use CSS modules?',
        initial: true,
      });
      console.log(useCssModules);
    }
  }
  private async selectTestLib() {
    const initial = await this.testAnalyzer.determineTestLib();
    const testLib = await this.ui.select<TTestLib>({
      message: 'Testing library:',
      initial,
      options: AVAILABLE_TEST_LIBS.map(value => ({
        value,
        name: value === 'rtl' ? 'React Testing Library' : value,
      })),
    });
    console.log(testLib);
  }
  private async selectComponentFilename() {
    const name = await this.ui.textInput({
      message: 'Filename of the component(without file extension):',
      initial: COMPONENT_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    console.log(name);
  }
  private async selectStyleFilename() {
    const name = await this.ui.textInput({
      message: 'Filename of the style(without file extension):',
      initial: STYLE_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    console.log(name);
  }
  private async selectTestFilename() {
    const name = await this.ui.textInput({
      message: 'Filename of the test(without file extension):',
      initial: TEST_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    console.log(name);
  }
  private async selectSbFilename() {
    const name = await this.ui.textInput({
      message: 'Filename of the stories(without file extension):',
      initial: STORIES_DEFAULT_FILENAME,
      trim: true,
      returnInitialIfEmpty: true,
    });
    console.log(name);
  }
}
