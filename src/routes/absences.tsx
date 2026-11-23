import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root';
import { SearchParamsSchema } from '../features/absences/schemas';
import { absencesQueryOptions } from '../features/absences/queries';
import AbsencesPage from '../features/absences/components/pages/AbsencesPage';
import AbsencesPageSkeleton from '../features/absences/components/pages/AbsencesPageSkeleton';
import AbsencesPageError from '../features/absences/components/pages/AbsencesPageError';

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