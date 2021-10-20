export interface ILogger {
  success(msg: string): void;
  log(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}
