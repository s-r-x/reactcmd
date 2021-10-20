import type { ILogger } from '../../lib/logger/interface';

export const createLoggerMock = (): ILogger => {
  return {
    log: () => {},
    warn: () => {},
    success: () => {},
    error: () => {},
  };
};
