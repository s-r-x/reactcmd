import yargs from 'yargs';
import {
  builder,
  command,
  desc,
  handler,
} from '../../lib/cli/commands/generate-cmds/component';
import fs from 'fs-extra';
import path from 'path';

import { createTempDir } from '../fixtures/create-temp-dir';
import { TPkg } from '../../lib/typings/pkg';
import { TCliConfigFile } from '../../lib/typings/config';
import { DEFAULT_CONFIG_FILE } from '../../lib/constants/config';
import { expect } from 'chai';
describe('E2E:: generate component', () => {
  it('should generate new component', async () => {
    const [cwd] = await createTempDir(true);
    const componentName = 'Name';
    const componentfile = 'componentfile';
    const storiesfile = 'storiesfile.stories';
    const testfile = 'testfile.test';
    const stylefile = 'stylefile';
    const srcDir = './source';
    const classname = 'my-class';
    const tag = 'span';
    const cfg: TCliConfigFile = {
      srcDir,
      commands: {
        generateComponent: {
          storiesfile: 'oldstoriesfile',
          stylefile,
          test: true,
          mobx: true,
          cc: true,
          classname,
          tag: 'p',
        },
      },
    };
    const pkg: TPkg = {
      dependencies: {
        less: '1',
      },
      devDependencies: {
        enzyme: '1',
      },
    };
    await fs.outputJSON(path.join(cwd, 'package.json'), pkg);
    await fs.outputJSON(path.join(cwd, DEFAULT_CONFIG_FILE), cfg);
    await yargs
      .command(command, desc, builder as any, handler)
      .parseAsync(
        `component ${componentName} --q --tag=${tag} --pure --redux --cfile=${componentfile} --sbfile=${storiesfile} --cssm --lang=ts --sb --tfile=${testfile}`
      );
    process.chdir(path.join(cwd, srcDir, componentName));
    const filesList = await fs.readdir('.');
    const finalComponentfile = `${componentfile}.tsx`;
    const finalStylefile = `${stylefile}.module.less`;
    const finalTestfile = `${testfile}.tsx`;
    const finalStoriesfile = `${storiesfile}.tsx`;
    expect(filesList).to.have.length(4);
    expect(filesList).to.include(finalStylefile);
    expect(filesList).to.include(finalStoriesfile);
    expect(filesList).to.include(finalTestfile);
    expect(filesList).to.include(finalComponentfile);

    const [component, style, test, stories] = await Promise.all([
      fs.readFile(finalComponentfile, 'utf8'),
      fs.readFile(finalStylefile, 'utf8'),
      fs.readFile(finalTestfile, 'utf8'),
      fs.readFile(finalStoriesfile, 'utf8'),
    ]);
    expect(component).to.include('redux');
    expect(component).to.include('mobx');
    expect(component).to.include('less');
    expect(component).to.include('PureComponent');
    expect(component).to.include(componentName);
    expect(component).to.include(classname);
    expect(component).to.include(tag);
    expect(style).to.include(classname);
    expect(test).to.include('enzyme');
    expect(test).to.include(componentName);
    expect(stories).to.include(componentName);
  });
});
