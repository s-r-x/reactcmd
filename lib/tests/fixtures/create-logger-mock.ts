import { ILogger } from '../../logger/interface';

export const createLoggerMock = (): ILogger => {
  return {
    warn: () => {},
    success: () => {},
    error: () => {},
  };
};
