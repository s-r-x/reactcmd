import type { TStylingStrategy } from '../../typings/styling';

export interface IStylingAnalyzer {
  determineStylingStrategy: () => Promise<TStylingStrategy>;
}
