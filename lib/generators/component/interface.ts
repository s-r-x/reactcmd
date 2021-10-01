export interface IComponentGenerator {
  gen(args: any): Promise<void>;
}
