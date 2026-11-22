import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import logo from '../assets/images/logo.svg';

export type RouterContext = {
	queryClient: QueryClient;
};

export const rootRoute = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<header className='sticky top-0 z-40 shadow-lg bg-white'>
				<div className="container px-4 md:px-8 py-4">
					<img src={logo} width="145" height="38" alt="BrightHR" />
				</div>
			</header>
			<main>
				<div className="container px-5 md:px-8 mt-10">
					<Outlet />
				</div>
			</main>
		</>
	),
});
