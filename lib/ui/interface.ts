export interface IConfirmOptions {
  name?: string;
  message: string;
  initial?: boolean;
}

export interface IUi {
  confirm(options: IConfirmOptions): Promise<boolean>;
  select<T extends string = string>(options: {
    name?: string;
    message: string;
    options: {
      value: T;
      name?: string;
    }[];
    initial?: T;
  }): Promise<T>;
}
