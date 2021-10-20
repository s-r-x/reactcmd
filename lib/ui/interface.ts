export interface IConfirmOptions {
  name?: string;
  message: string;
  initial?: boolean;
}

interface ISelectOption {
  name: string;
  message?: string;
}
export interface ISelectOptions {
  name?: string;
  message: string;
  options: ISelectOption[];
  initial?: string;
}
export interface IUi {
  confirm(options: IConfirmOptions): Promise<boolean>;
  select(options: ISelectOptions): Promise<string>;
}
