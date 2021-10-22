import { TLang } from '../../typings';
import { TStylingStrategy } from '../../typings/styling';
import { TTestLib, TTestRunner } from '../../typings/testing';

export interface IGenerateComponentOptions {
  name: string;
  dir?: string;
  ugly?: boolean;
  pure?: boolean;
  mobx?: boolean;
  tag?: string;
  redux?: boolean;
  style?: TStylingStrategy;
  test?: boolean;
  sb?: boolean;
  cc?: boolean;
  fc?: boolean;
  testlib?: TTestLib;
  testrunner?: TTestRunner;
  cssmodules?: boolean;
  classname?: string;
  componentfile?: string;
  testfile?: string;
  storiesfile?: string;
  stylefile?: string;
  dry?: boolean;
  lang?: TLang;
  y?: boolean;
}
export interface IComponentGenerator {
  gen(args: IGenerateComponentOptions): Promise<void>;
}
