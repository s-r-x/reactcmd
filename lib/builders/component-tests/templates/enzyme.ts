import _ from 'lodash';

export const enzymeTemplate = _.template(`
import React from 'react';
import { shallow } from 'enzyme';
import <%= componentName %> from '<%= importPath %>';

test('should render', async () => {
  shallow(<<%= componentName %> />);
})
`);
