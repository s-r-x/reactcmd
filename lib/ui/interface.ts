export interface IConfirmOptions {
  name?: string;
  message: string;
  initial?: boolean;
}
export interface IUi {
  confirm(options: IConfirmOptions): Promise<boolean>;
}
