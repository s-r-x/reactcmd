import { CssCompatibleStyleBuilder } from '..';

export class LessStyleBuilder extends CssCompatibleStyleBuilder {
  protected override immutableFileExt = '.less';
}
