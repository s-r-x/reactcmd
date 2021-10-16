import { expect } from 'chai';
import { CliUi } from '.';

describe.skip('CliUi', () => {
  it('confirm', async () => {
    const ui = new CliUi();
    const res = await ui.confirm({ message: 'hi?', initial: true });
    console.log(res);
    expect(true).to.be.true;
  });
});
