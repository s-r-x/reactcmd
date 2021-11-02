import { inject, injectable } from 'inversify';
import { NextPageBuilder } from '../../builders/next-page';
import { TOKENS } from '../../ioc/tokens';
import type { ILogger } from '../../logger/interface';
import type { INextPageGenInputNormalizer } from '../../normalizers/next-page-gen-input/interface';
import type { IFileWriter } from '../../writers/file/interface';
import type {
  IGenerateNextPageOptions as IOptions,
  INextPageGenerator,
} from './interface';
import path from 'path';
import chalk from 'chalk';

@injectable()
export class NextPageGenerator implements INextPageGenerator {
  constructor(
    @inject(TOKENS.nextPageGenInputNrmlz)
    private inputNormalizer: INextPageGenInputNormalizer,
    private pageBuilder: NextPageBuilder,
    @inject(TOKENS.logger) private logger: ILogger,
    @inject(TOKENS.fileWriter) private fileWriter: IFileWriter
  ) {}
  async gen(rawOpts: IOptions) {
    const opts = await this.inputNormalizer.normalize(rawOpts);
    const content = this.genPageContent(opts);
    if (!opts.dry) {
      await this.fileWriter.write({
        path: opts.path,
        content,
        shouldFormat: true,
        shouldPromptOnOverride: !opts.y,
      });
    }
    if (!opts.quite) {
      this.logger.log(
        chalk.green('+') + ' ' + path.relative(process.cwd(), opts.path) + '\n'
      );
    }
  }
  private genPageContent(opts: IOptions) {
    const bldr = this.pageBuilder;
    if (opts.gsp) {
      bldr.withGetStaticProps();
    }
    if (opts.gsps) {
      bldr.withGetStaticPaths();
    }
    if (opts.gssp) {
      bldr.withGetServerSideProps();
    }
    if (opts.lang === 'ts') {
      bldr.withTypescript();
    }
    if (opts.pure) {
      bldr.makePure();
    }
    if (opts.tag) {
      bldr.withTag(opts.tag);
    }
    if (opts.fc) {
      bldr.asFC();
    } else if (opts.cc) {
      bldr.asClassComponent();
    }
    if (opts.mobx) {
      bldr.withMobx();
    }
    if (opts.redux) {
      bldr.withRedux();
    }
    return bldr.build();
  }
}
