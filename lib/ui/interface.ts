interface ISharedUiOptions<TInitial> {
  name?: string;
  message: string;
  initial?: TInitial;
}

export interface IConfirmOptions extends ISharedUiOptions<boolean> {}
export interface ITextInputOptions extends ISharedUiOptions<string> {
  trim?: boolean;
  returnInitialIfEmpty?: boolean;
}
export interface ISelectOptions<T extends string> extends ISharedUiOptions<T> {
  name?: string;
  message: string;
  options: {
    value: T;
    name?: string;
  }[];
}

export interface IUi {
  confirm(options: IConfirmOptions): Promise<boolean>;
  textInput(options: ITextInputOptions): Promise<string>;
  select<T extends string = string>(options: ISelectOptions<T>): Promise<T>;
}
