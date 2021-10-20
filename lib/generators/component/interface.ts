export interface IGenerateComponentOptions {
  name: string;
  dir?: string;
  ts?: boolean;
  js?: boolean;
  ugly?: boolean;
  pure?: boolean;
  mobx?: boolean;
  tag?: string;
  redux?: boolean;
  style?: string;
  test?: boolean;
  sb?: boolean;
  cc?: boolean;
  fc?: boolean;
  testlib?: string;
  testrunner?: string;
  cssmodules?: boolean;
  classname?: string;
  componentfile?: string;
  testfile?: string;
  storiesfile?: string;
  stylefile?: string;
}
export interface IComponentGenerator {
  gen(args: IGenerateComponentOptions): Promise<void>;
}
