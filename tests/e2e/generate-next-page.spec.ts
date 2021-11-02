import yargs from 'yargs';
import {
  builder,
  command,
  desc,
  handler,
} from '../../lib/cli/commands/generate-cmds/next-cmds/page';
import fs from 'fs-extra';
import path from 'path';
import { createTempDir } from '../fixtures/create-temp-dir';
import type { TCliConfigFile } from '../../lib/typings/config';
import { DEFAULT_CONFIG_FILE } from '../../lib/constants/config';
import { expect } from 'chai';

describe('E2E:: generate next page', () => {
  it('should generate new next page', async () => {
    const [cwd] = await createTempDir(true);
    const srcDir = './';
    const pagesDir = 'my-pages-dir';
    const pagePath = 'article/[slug]';
    const finalPageDir = path.join(cwd, srcDir, pagesDir, 'article');
    const tag = 'time';
    const cfg: TCliConfigFile = {
      srcDir,
      commands: {
        generateNextPage: {
          dir: 'some-dir',
          gsp: true,
          gssp: true,
          pure: false,
          redux: true,
        },
      },
    };
    await Promise.all([
      fs.outputJSON(path.join(cwd, 'package.json'), {}),
      fs.outputJSON(path.join(cwd, DEFAULT_CONFIG_FILE), cfg),
    ]);
    await yargs
      .command(command, desc, builder as any, handler)
      .parseAsync(
        `page ${pagePath} ${pagesDir} --mobx --gsps --gsp=false --fc --q --tag=${tag} --pure --lang=ts`
      );
    process.chdir(finalPageDir);
    const filesList = await fs.readdir('.');
    expect(filesList).to.have.length(1);
    expect(filesList).to.include('[slug].tsx');
    const page = await fs.readFile('[slug].tsx', 'utf8');
    expect(page).to.include(tag);
    expect(page).to.include('getServerSideProps');
    expect(page).to.include('redux');
    expect(page).to.include('mobx');
    expect(page).to.include('getStaticPaths');
    expect(page).to.not.include('getStaticProps');
    expect(page).to.include('memo');
  });
});
