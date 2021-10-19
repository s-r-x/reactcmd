import _ from 'lodash';
export const aphroditeStylesTemplate = _.template(
  `
import { StyleSheet } from 'aphrodite';

export const <%= exportName %> = StyleSheet.create({
  "<%= rootClass %>": {}
});
`
);
