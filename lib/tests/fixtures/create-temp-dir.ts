import tmp from 'tmp';
tmp.setGracefulCleanup();

export const createTempDir = (chdir = false): Promise<[string, () => void]> => {
  return new Promise((res, rej) => {
    tmp.dir((err, dir, cleanup) => {
      if (err) {
        rej(err);
      } else {
        if (chdir) {
          process.chdir(dir);
        }
        res([dir, cleanup]);
      }
    });
  });
};
