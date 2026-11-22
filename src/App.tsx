import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { rootRoute } from './routes/root';
import { absencesRoute } from './routes/absences';

const queryClient = new QueryClient();
const routeTree = rootRoute.addChildren([absencesRoute]);
const router = createRouter({ 
	routeTree,
	context: {
		queryClient,
	}
});

function App() {

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
