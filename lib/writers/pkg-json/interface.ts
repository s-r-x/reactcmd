import { TAnyDict } from '../../typings/utils';

export interface IPkgJsonWriter {
  writeField(field: string, payload: TAnyDict | string): Promise<void>;
}
