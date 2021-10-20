export interface IConfirmOptions {
  name?: string;
  message: string;
  initial?: boolean;
}

interface ISelectOption {
  value?: string;
  name: string;
}
export interface ISelectOptions {
  name?: string;
  message: string;
  options: ISelectOption[];
  initial?: string;
}
export interface IUi {
  confirm(options: IConfirmOptions): Promise<boolean>;
  select<T extends string = string>(options: ISelectOptions): Promise<T>;
}
