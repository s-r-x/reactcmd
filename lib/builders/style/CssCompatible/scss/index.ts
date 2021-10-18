import { CssCompatibleStyleBuilder } from '..';

export class ScssStyleBuilder extends CssCompatibleStyleBuilder {
  protected override immutableFileExt = '.scss';
}
