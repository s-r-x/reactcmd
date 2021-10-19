import { injectable } from 'inversify';
import type { ComponentBuilder } from '.';
import type {
  IComponentBuilderFacade,
  IComponentGeneratorSpec,
} from './interface';

@injectable()
export class ComponentBuilderFacade implements IComponentBuilderFacade {
  constructor(private builder: ComponentBuilder) {}
  buildUsingComponentGeneratorSpec(spec: IComponentGeneratorSpec): string {
    const { builder } = this;
    builder.reset().withComponentName(spec.name);
    if (spec.fc) {
      builder.asFC();
    }
    if (spec.cc) {
      builder.asClassComponent();
    }
    if (spec.ts) {
      builder.withTypescript();
    }
    if (spec.tag) {
      builder.withTag(spec.tag);
    }
    if (spec.mobx) {
      builder.withMobx();
    }
    if (spec.redux) {
      builder.withRedux();
    }
    if (spec.pure) {
      builder.makePure();
    }
    if (spec.imports) {
      builder.withExtraImports(spec.imports);
    }
    if (spec.hocs) {
      builder.withExtraHocs(spec.hocs);
    }
    if (spec.jsx) {
      builder.withJsx(spec.jsx);
    }
    return builder.build();
  }
}
