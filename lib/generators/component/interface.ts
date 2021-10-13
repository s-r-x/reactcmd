export interface IGenerateComponentOptions {
  name: string;
  dir?: string;
  ts?: boolean;
  js?: boolean;
  nostyle?: boolean;
  pure?: boolean;
  mobx?: boolean;
  redux?: boolean;
  style?: string;
  stories?: boolean;
  class?: boolean;
  fc?: boolean;
}
export interface IComponentGenerator {
  gen(args: IGenerateComponentOptions): Promise<void>;
}
