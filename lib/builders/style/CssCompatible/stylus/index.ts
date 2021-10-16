import { CssCompatibleStyleBuilder } from '..';
import { DEFAULT_STYLUS_CSS_RULES } from '../../constants';

export class StylusStyleBuilder extends CssCompatibleStyleBuilder {
  protected override fileExt = '.styl';
  protected override buildStyles(className: string) {
    return `.${className}\n\t${DEFAULT_STYLUS_CSS_RULES}`;
  }
}
