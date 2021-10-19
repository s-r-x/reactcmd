import _ from 'lodash';
export const radiumStylesTemplate = _.template(
  `
export const <%= exportName %> = {
  "<%= rootClass %>": {}
};
`
);
