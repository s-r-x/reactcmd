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
  cssmodules?: boolean;
}
export interface IComponentGenerator {
  gen(args: IGenerateComponentOptions): Promise<void>;
}
