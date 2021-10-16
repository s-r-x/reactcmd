import _ from 'lodash';

export const reactTestingLibraryTemplate = _.template(`
import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import <%= componentName %> from '<%= importPath %>';

test('should render', async () => {
  render(<<%= componentName %> />);
	screen.debug();
})
`);
