import PrettyError from 'pretty-error';

export const enablePrettyErrors = () => {
  const pe = new PrettyError();
  pe.skipPackage('yargs');
  pe.start();
};
