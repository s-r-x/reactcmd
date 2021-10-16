export interface IConfirmOptions {
  name?: string;
  message: string;
  initial?: boolean;
}
export interface ICliUi {
  confirm(options: IConfirmOptions): Promise<boolean>;
}
