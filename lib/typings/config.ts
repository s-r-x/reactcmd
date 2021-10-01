import { TStylingStrategy } from './styling';

export type TCliConfigFile = {
  component: {
    styling?: TStylingStrategy;
    ts?: boolean;
  };
};
