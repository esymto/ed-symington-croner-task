import { createRoute, type ErrorComponentProps } from '@tanstack/react-router';
import { rootRoute } from './root';
import { SearchParamsSchema } from '../features/absences/schemas';
import { absencesQueryOptions } from '../features/absences/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import Table from '../features/absences/components/tables/Table';
import { Title } from '../features/absences/components/page-elements/Title';
import { ZodError } from 'zod';

export const absencesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	validateSearch: SearchParamsSchema,
	loader: async ({ context }) => {
		await context.queryClient.query(absencesQueryOptions());
	},
	component: AbsencesPage,
	pendingComponent: AbsencesPageSkeleton,
	pendingMs: 300,
	pendingMinMs: 500,
	errorComponent: AbsencesPageError
});

function AbsencesPage() {

	const { data } = useSuspenseQuery(absencesQueryOptions());

	return (
		<>
			<Title text="Absences" />
			<Table data={data} />
		</>
	)
}

function AbsencesPageSkeleton() {
	return (
		<>
			<Title text="Absences" />
			Loading...
		</>
	)
}

function AbsencesPageError({ error }: ErrorComponentProps) {

	let errorMessage = 'Error: An unexpected error occurred.';

	if (error instanceof ZodError) {

		errorMessage = 'API errors occurred: ';
		errorMessage += error.issues
			.map((issue) =>
				issue.path.length > 0
					? `\n${issue.path.join(' - ')}: ${issue.message}`
					: `\n${issue.message}`,
			).join();

	} else if (error instanceof Error) {

		errorMessage = `Error: ${error.message}`;
	}

	return (
		<>
			<Title text="Absences" />
			<p className='whitespace-pre-line'>{errorMessage}</p>
		</>
	)
}