export interface IEnvReader {
  getCliRootDir(): string;
  getProjectRootDir(): string;
}
