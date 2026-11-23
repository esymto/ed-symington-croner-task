import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { rootRoute } from '../../../../../routes/root';
import { absencesRoute } from '../../../../../routes/absences';
import type { Absence } from '../../../schemas';

// 12 absences, so there are 2 pages of 10.
// Names are alphabetical, start dates run in reverse (Alice latest, Liam earliest),
// and Liam's long absence makes his end date the latest, so each column sorts differently.
const FIRST_NAMES = ['Alice', 'Ben', 'Cara', 'Dan', 'Eve', 'Finn', 'Gina', 'Hugo', 'Iris', 'Jack', 'Kate', 'Liam'];

const absences: Absence[] = FIRST_NAMES.map((firstName, i) => {

	const day = String(24 - (i * 2)).padStart(2, '0');

	let absenceType: Absence['absenceType'] = 'ANNUAL_LEAVE';

	if (firstName === 'Alice') {
		absenceType = 'SICKNESS';
	} else if (firstName === 'Ben') {
		absenceType = 'MEDICAL';
	}

	return {
		id: i + 1,
		startDate: `2024-01-${day}T12:00:00.000Z`,
		days: firstName === 'Liam' ? 30 : 1,
		absenceType,
		employee: { id: `emp-${i + 1}`, firstName, lastName: 'Smith' },
		approved: i % 2 === 0,
	};
});

function jsonResponse(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

function renderPage(path = '/') {

	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	const router = createRouter({
		routeTree: rootRoute.addChildren([absencesRoute]),
		context: { queryClient },
		history: createMemoryHistory({ initialEntries: [path] }),
	});

	render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
	);

	return { router, user: userEvent.setup() };
}

function bodyRows(): HTMLElement[] {
	return within(screen.getByRole('table')).getAllByRole('row').slice(1);
}

function employeeNames(): string[] {
	return bodyRows().map((row) => within(row).getAllByRole('cell')[0].textContent ?? '');
}

function types(): string[] {
	return bodyRows().map((row) => within(row).getAllByRole('cell')[4].textContent ?? '');
}

function pageIndicator(): string {
	return screen.getByText((_, element) => element?.tagName === 'SPAN' && /^Page \d+ of \d+$/.test(element.textContent ?? '')).textContent ?? '';
}

function header(name: string): HTMLElement {
	return screen.getByRole('columnheader', { name });
}

function sortButton(name: string): HTMLElement {
	return screen.getByRole('button', { name });
}

beforeEach(() => {

	vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {

		const url = input.toString();

		if (url.endsWith('/api/absences')) {
			return jsonResponse(absences);
		}

		return jsonResponse({ conflicts: false });
	}));
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('Table sorting', () => {

	it('sorts by employee ascending by default', async () => {

		renderPage();
		await screen.findByRole('table');

		expect(employeeNames()).toEqual(FIRST_NAMES.slice(0, 10).map((name) => `${name} Smith`));
		expect(header('Employee')).toHaveAttribute('aria-sort', 'ascending');
		expect(header('Start Date')).toHaveAttribute('aria-sort', 'none');
	});

	it('toggles direction when the sorted column is clicked again', async () => {

		const { router, user } = renderPage();
		await screen.findByRole('table');

		await user.click(sortButton('Employee'));

		await waitFor(() => expect(employeeNames()[0]).toBe('Liam Smith'));
		expect(header('Employee')).toHaveAttribute('aria-sort', 'descending');
		expect(router.state.location.search).toMatchObject({ sort: 'employee', direction: 'desc' });

		await user.click(sortButton('Employee'));

		await waitFor(() => expect(employeeNames()[0]).toBe('Alice Smith'));
		expect(header('Employee')).toHaveAttribute('aria-sort', 'ascending');
	});

	it('sorts by start date', async () => {

		const { router, user } = renderPage();
		await screen.findByRole('table');

		await user.click(sortButton('Start Date'));

		await waitFor(() => expect(employeeNames()[0]).toBe('Liam Smith'));
		expect(header('Start Date')).toHaveAttribute('aria-sort', 'ascending');
		expect(header('Employee')).toHaveAttribute('aria-sort', 'none');
		expect(router.state.location.search).toMatchObject({ sort: 'startDate', direction: 'asc' });

		await user.click(sortButton('Start Date'));

		await waitFor(() => expect(employeeNames()[0]).toBe('Alice Smith'));
	});

	it('sorts by end date calculated from start date and days', async () => {

		const { user } = renderPage();
		await screen.findByRole('table');

		// Liam starts earliest but ends latest, so end date order differs from start date order
		await user.click(sortButton('End Date'));
		await waitFor(() => expect(employeeNames()[0]).toBe('Kate Smith'));

		await user.click(sortButton('End Date'));
		await waitFor(() => expect(employeeNames()[0]).toBe('Liam Smith'));
	});

	it('sorts by absence type', async () => {

		const { user } = renderPage();
		await screen.findByRole('table');

		await user.click(sortButton('Type'));
		await waitFor(() => expect(types()[0]).toBe('ANNUAL LEAVE'));
		expect(types().every((type) => type === 'ANNUAL LEAVE')).toBe(true);

		await user.click(sortButton('Type'));
		await waitFor(() => expect(types().slice(0, 3)).toEqual(['SICKNESS', 'MEDICAL', 'ANNUAL LEAVE']));
	});

	it('does not allow sorting by status or conflicts', async () => {

		renderPage();
		await screen.findByRole('table');

		expect(screen.queryByRole('button', { name: 'Status' })).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Conflicts' })).not.toBeInTheDocument();
		expect(header('Status')).not.toHaveAttribute('aria-sort');
		expect(header('Conflicts')).not.toHaveAttribute('aria-sort');
	});

	it('resets to page 1 when the sort changes', async () => {

		const { router, user } = renderPage('/?page=2');
		await screen.findByRole('table');
		expect(pageIndicator()).toBe('Page 2 of 2');

		await user.click(sortButton('Start Date'));

		await waitFor(() => expect(pageIndicator()).toBe('Page 1 of 2'));
		expect(router.state.location.search).toMatchObject({ page: 1 });
	});
});

describe('Table pagination', () => {

	it('shows 10 rows on the first page', async () => {

		renderPage();
		await screen.findByRole('table');

		expect(bodyRows()).toHaveLength(10);
		expect(pageIndicator()).toBe('Page 1 of 2');
		expect(sortButton('Previous Page')).toBeDisabled();
		expect(sortButton('Next Page')).toBeEnabled();
	});

	it('moves between pages with the next and previous buttons', async () => {

		const { router, user } = renderPage();
		await screen.findByRole('table');

		await user.click(screen.getByRole('button', { name: 'Next Page' }));

		await waitFor(() => expect(employeeNames()).toEqual(['Kate Smith', 'Liam Smith']));
		expect(pageIndicator()).toBe('Page 2 of 2');
		expect(screen.getByRole('button', { name: 'Next Page' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Previous Page' })).toBeEnabled();
		expect(router.state.location.search).toMatchObject({ page: 2 });

		await user.click(screen.getByRole('button', { name: 'Previous Page' }));

		await waitFor(() => expect(pageIndicator()).toBe('Page 1 of 2'));
		expect(bodyRows()).toHaveLength(10);
	});

	it('reads the sort and page from the URL', async () => {

		renderPage('/?sort=startDate&direction=desc&page=2');
		await screen.findByRole('table');

		expect(pageIndicator()).toBe('Page 2 of 2');
		expect(employeeNames()).toEqual(['Kate Smith', 'Liam Smith']);
		expect(header('Start Date')).toHaveAttribute('aria-sort', 'descending');
	});

	it('redirects a page beyond the last page to the last page', async () => {

		const { router } = renderPage('/?page=999');
		await screen.findByRole('table');

		await waitFor(() => expect(router.state.location.search).toMatchObject({ page: 2 }));
		expect(pageIndicator()).toBe('Page 2 of 2');
	});

	it('falls back to the defaults for invalid search params', async () => {

		renderPage('/?sort=banana&direction=sideways&page=-3');
		await screen.findByRole('table');

		expect(pageIndicator()).toBe('Page 1 of 2');
		expect(employeeNames()[0]).toBe('Alice Smith');
		expect(header('Employee')).toHaveAttribute('aria-sort', 'ascending');
	});
});
