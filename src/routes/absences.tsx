import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root';
import Absences from '../components/Absences';
import { SearchParamsSchema } from '../schemas/search-params';

export const absencesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	validateSearch: SearchParamsSchema,
	component: Absences,
});
