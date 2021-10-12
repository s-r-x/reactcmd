import _ from 'lodash';

export const componentTmpl = _.template(`
	<%= imports %>

	<%= header %>

	<%= componentHead %>

		<%= componentBody %>

		return (
			<%= JSX %>
		)
	};
	<%= footer %>

	<%= exports %>
`);
