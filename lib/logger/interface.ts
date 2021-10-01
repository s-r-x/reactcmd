export interface ILogger {
  success(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}
