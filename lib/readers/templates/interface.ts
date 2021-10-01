export interface ITmplReader {
  readTemplate(tmpl: string): Promise<string>;
}
