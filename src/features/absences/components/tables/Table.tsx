import { useEffect, useMemo } from 'react';
import type { Absence, SearchParams } from '../../schemas';
import { absencesRoute } from '../../../../routes/absences';
import { 
	useTable, 
	tableFeatures, 
	type ColumnDef, 
	type SortingState, 
	type PaginationState, 
	rowSortingFeature, 
	createSortedRowModel, 
	rowPaginationFeature, 
	createPaginatedRowModel, 
	sortFn_alphanumeric, 
	sortFn_basic 
} from '@tanstack/react-table';
import ConflictCell from './ConflictCell';

type Props = {
	data: Absence[];
};

const ROWS_PER_PAGE = 10;

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	rowPaginationFeature,
	paginatedRowModel: createPaginatedRowModel(),
});

const columns: Array<ColumnDef<typeof features, Absence>> = [
	{
		id: 'employee',
		accessorFn: (row) => `${row.employee.firstName} ${row.employee.lastName}`,
		header: 'Employee',
		cell: (info) => info.getValue(),
		sortFn: sortFn_alphanumeric,
	},
	{
		id: 'startDate',
		accessorFn: (row) => new Date(row.startDate).getTime(),
		header: 'Start Date',
		cell: (info) => {

			const timestamp = info.getValue() as number;
			return new Date(timestamp).toLocaleDateString('en-GB');
		},
		sortFn: sortFn_basic,
	},
	{
		id: 'endDate',
		accessorFn: (row) => {

			const endDate = new Date(row.startDate);
			endDate.setDate(endDate.getDate() + (row.days - 1));
			return endDate.getTime();
		},
		header: 'End Date',
		cell: (info) => {

			const timestamp = info.getValue() as number;
			return new Date(timestamp).toLocaleDateString('en-GB');
		},
		sortFn: sortFn_basic,
	},
	{
		id: 'status',
		accessorKey: 'approved',
		header: 'Status',
		cell: (info) => {

			const approved = info.getValue() as boolean;
			return approved ? 'Approved' : 'Pending approval';
		},
		enableSorting: false,
	},
	{
		id: 'type',
		accessorKey: 'absenceType',
		header: 'Type',
		cell: (info) => info.getValue(),
		sortFn: sortFn_alphanumeric,
	},
	{
		id: 'clashes',
		accessorFn: (row) => row.id,
		header: 'Has Conflicts',
		cell: (info) => <ConflictCell absenceId={info.getValue() as number} />,
		enableSorting: false,
	},
];

export default function Table({ data }: Props) {

	const { sort, direction, page } = absencesRoute.useSearch();
	const navigate = absencesRoute.useNavigate();
	const sorting = useMemo<SortingState>(() => [{ id: sort, desc: direction === 'desc' }], [sort, direction]);
	const numPages = Math.max(1, Math.ceil(data.length / ROWS_PER_PAGE));
	
	const pagination = useMemo<PaginationState>(() => {

		let currentPage = page < 1 ? 1 : page;

		if(currentPage > numPages) {
			
			currentPage = numPages;
		}

		return {
			pageIndex: currentPage - 1,
			pageSize: ROWS_PER_PAGE
		};

	}, [page]);

	useEffect(() => {

		// Redirect if URL param is outside pagination bounds (Zod already fixes < 0)
		if (page > numPages) {

			navigate({
				replace: true,
				search: (prev: SearchParams) => ({
					...prev,
					page: numPages,
				}),
			});
		}

	}, [page, numPages, navigate]);

	const currentPage = pagination.pageIndex + 1;
	
	if(!data.length) {
		return <p>No absences found.</p>
	}
	
	const table = useTable({
		features,
		columns,
		data,
		state: {
			sorting,
			pagination
		}
	});
	
	const sortHandler = (columnId: string) => {
		
		const isSameColumn = sort === columnId;
		const nextDirection: 'asc' | 'desc' = isSameColumn && direction === 'asc' ? 'desc' : 'asc';

		navigate({
			search: (prev: SearchParams) => ({
				...prev,
				sort: columnId as typeof prev.sort,
				direction: nextDirection,
				page: 1,
			}),
		});
	};

	const paginationClickHandler = (nextPage: number) => {
		
		let clampedNextPage = nextPage;

		if(nextPage > numPages) {

			clampedNextPage = numPages;

		} else if(nextPage < 1) {

			clampedNextPage = 1;
		}

		navigate({
			search: (prev: SearchParams) => ({
				...prev,
				page: clampedNextPage,
			}),
		});
	};

	return (
		<>
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th 
									key={header.id}
									onClick={header.column.getCanSort() ? () => sortHandler(header.column.id) : undefined}
									className={header.column.getCanSort() ? 'cursor-pointer' : ''}
								>
									{header.isPlaceholder ? null : (
										<>
											<table.FlexRender header={header} />
											{header.column.getIsSorted() === 'asc' && ' ▲'}
											{header.column.getIsSorted() === 'desc' && ' ▼'}
										</>
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getAllCells().map((cell) => (
								<td key={cell.id}>
									<table.FlexRender cell={cell} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div className='flex justify-between'>
				<span>
					Page {currentPage} of {numPages}
				</span>
				<div className='flex gap-x-2'>
					<button
						type="button"
						onClick={() => paginationClickHandler(currentPage - 1)}
						disabled={!table.getCanPreviousPage()}
						className='cursor-pointer'
					>
						Previous Page
					</button>
					<button
						type="button"
						onClick={() => paginationClickHandler(currentPage + 1)}
						disabled={!table.getCanNextPage()}
						className='cursor-pointer'
					>
						Next Page
					</button>
				</div>
			</div>
		</>
	);
}
