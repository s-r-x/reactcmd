import { ContainerModule } from 'inversify';
import { ComponentBuilder } from '../../builders/component';
import { ComponentStoriesBuilder } from '../../builders/component-stories';
import type { IComponentStoriesBuilder } from '../../builders/component-stories/interface';
import { ComponentTestsBuilder } from '../../builders/component-tests';
import type { IComponentTestsBuilder } from '../../builders/component-tests/interface';
import { NextPageBuilder } from '../../builders/next-page';
import { TOKENS } from '../tokens';

export const buildersModule = new ContainerModule(bind => {
  bind(ComponentBuilder).toSelf();
  bind(NextPageBuilder).toSelf();
  bind<IComponentTestsBuilder>(TOKENS.componentTestsBuilder).to(
    ComponentTestsBuilder
  );
  bind<IComponentStoriesBuilder>(TOKENS.componentStoriesBuilder).to(
    ComponentStoriesBuilder
  );
});
