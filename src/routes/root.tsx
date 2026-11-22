import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import logo from '../assets/logo.svg';

export type RouterContext = {
	queryClient: QueryClient;
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<header>
				<div className="container px-8 py-4">
					<img src={logo} width="145" height="38" alt="BrightHR" />
				</div>
			</header>
			<main>
				<div className="container px-8 mt-4">
					<Outlet />
				</div>
			</main>
		</>
	),
});
