import { CssCompatibleStyleBuilder } from '..';

export class LessStyleBuilder extends CssCompatibleStyleBuilder {
  protected override fileExt = '.less';
}
