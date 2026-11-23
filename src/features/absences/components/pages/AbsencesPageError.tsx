import { type ErrorComponentProps } from '@tanstack/react-router';
import { ZodError } from 'zod';
import { Title } from '../page-elements/Title';

export default function AbsencesPageError({ error }: ErrorComponentProps) {

	let errorMessage = 'Error: An unexpected error occurred.';

	if (error instanceof ZodError) {

		errorMessage = 'API errors occurred: ';
		errorMessage += error.issues
			.map((issue) =>
				issue.path.length > 0
					? `\n${issue.path.join(' - ')}: ${issue.message}`
					: `\n${issue.message}`,
			).join('');

	} else if (error instanceof Error) {

		errorMessage = `Error: ${error.message}`;
	}

	return (
		<>
			<Title text="Absences" />
			<p className='whitespace-pre-line'>{errorMessage}</p>
		</>
	);
}
