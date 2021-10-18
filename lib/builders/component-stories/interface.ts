export interface IComponentStoriesBuilder {
  build(): string;
  withComponentName(name: string): this;
  withComponentImportPath(path: string): this;
  withTypescript(): this;
}
