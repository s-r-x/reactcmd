import * as path from 'path';
import fs from 'fs-extra';
import type { TStringDict } from '../typings/utils';
import type { PackageJson as TPkgJson } from 'type-fest';
import pkgDir from 'pkg-dir';

export abstract class AbstractGenerator {
  public abstract generate(...args: any): any;
  constructor() {
    this._determinePkgDir();
    this._determineTemplatesDir();
    this._scanPkg();
  }
  protected _pkgDir: string = process.cwd();
  protected _deps: TStringDict = {};
  protected _devDeps: TStringDict = {};
  protected _readTmpl(name: string): string {
    return fs.readFileSync(path.join(this._templatesDir, name), 'utf8');
  }

  private _templatesDir: string = __dirname;
  private _scanPkg() {
    const pkg: TPkgJson = fs.readJSONSync(this._pkgPath);
    if (!pkg) return;
    if (pkg.dependencies) {
      this._deps = pkg.dependencies;
    }
    if (pkg.devDependencies) {
      this._devDeps = pkg.devDependencies;
    }
  }
  private _determinePkgDir() {
    const dir = pkgDir.sync(process.cwd());
    if (!dir) {
      throw new Error('Cannot find package.json');
    } else {
      this._pkgDir = dir;
    }
  }
  private _determineTemplatesDir() {
    this._templatesDir = path.resolve(__dirname, '..', '..', 'templates');
  }
  private get _pkgPath() {
    return path.join(this._pkgDir, 'package.json');
  }
}
