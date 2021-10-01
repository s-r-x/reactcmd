export class NoRootDirError extends Error {
  constructor(msg: any) {
    super(msg);
    this.message = msg;
    this.name = 'NoRootDirError';
  }
}
