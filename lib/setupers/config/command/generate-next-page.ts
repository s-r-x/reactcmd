import { injectable } from 'inversify';
import type { TCliConfigFile as TCfg } from '../../../typings/config';
import { CfgCmdSetuper } from './abstract';
import _ from 'lodash';
import { NEXT_DEFAULT_PAGES_FOLDER } from '../../../generators/next-page/constants';

@injectable()
export class GenerateNextPageCmdSetuper extends CfgCmdSetuper<'generateNextPage'> {
  protected cmdName: 'generateNextPage' = 'generateNextPage';
  protected async setupCommand(cfg: TCfg) {
    this.setLang(cfg);
    await this.selectPagesFolder(cfg);
    await this.selectNextSpecifics(cfg);
  }

  private setLang(cfg: TCfg) {
    if (cfg.lang && !this.getField(cfg, 'lang')) {
      this.setField(cfg, 'lang', cfg.lang);
    }
  }
  private async selectPagesFolder(cfg: TCfg) {
    const dir = await this.ui.textInput({
      message: 'Next.js pages folder(relative to the project source folder):',
      initial: NEXT_DEFAULT_PAGES_FOLDER,
      trim: true,
      returnInitialIfEmpty: true,
    });
    this.setField(cfg, 'dir', dir);
  }
  private async selectNextSpecifics(cfg: TCfg) {
    const gsp = await this.ui.confirm({
      message: 'Insert getStaticProps by default?',
    });
    this.setField(cfg, 'gsp', gsp);
    const gssp = await this.ui.confirm({
      message: 'Insert getServerSideProps by default?',
    });
    this.setField(cfg, 'gssp', gssp);
    const gsps = await this.ui.confirm({
      message: 'Insert getStaticPaths by default?',
    });
    this.setField(cfg, 'gsps', gsps);
  }
}
