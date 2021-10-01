export class NoTemplateError extends Error {
  constructor(msg: any) {
    super(msg);
    this.name = 'NoTemplateError';
    this.message = msg;
  }
}
