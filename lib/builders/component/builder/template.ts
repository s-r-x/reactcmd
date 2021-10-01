import _ from 'lodash';

export const componentTmpl = _.template(`
	<%= imports %>

	<%= declarations %>

	<%= componentHead %>

		<%= componentBody %>

		return (
			<%= componentContent %>
		)
	};
	<%= afterComponent %>

	<%= exports %>
`);
