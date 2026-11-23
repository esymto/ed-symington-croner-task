import './Table.css';
import { useEffect, useMemo } from 'react';
import type { Absence, SearchParams } from '../../schemas';
import { getEndDateExcludingWeekends } from '../../utils';
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
import StatusLabel from './StatusLabel';
import TypeLabel from './TypeLabel';
import iconSortable from '../../../../assets/images/icons/sortable.svg';
import iconSortedAsc from '../../../../assets/images/icons/sorted-asc.svg';
import iconSortedDesc from '../../../../assets/images/icons/sorted-desc.svg';

type Props = {
	data: Absence[];
};

const ROWS_PER_PAGE = 10;
const SORT_ICON_SIZE = 10;

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
		accessorFn: (row) => getEndDateExcludingWeekends(row.startDate, row.days).getTime(),
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
			return <StatusLabel approved={approved} />;
		},
		enableSorting: false,
	},
	{
		id: 'type',
		accessorFn: (row) => row.absenceType.replaceAll('_', ' '),
		header: 'Type',
		cell: (info) => <TypeLabel text={info.getValue() as string} />,
		sortFn: sortFn_alphanumeric,
	},
	{
		id: 'conflicts',
		accessorFn: (row) => row.id,
		header: 'Conflicts',
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

	}, [page, numPages]);

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
	
	const table = useTable({
		features,
		columns,
		data,
		state: {
			sorting,
			pagination
		}
	});

	if(!data.length) {
		return <p>No absences found.</p>;
	}
	
	const sortHandler = (columnId: string) => {
		
		const isSameColumn = sort === columnId;
		const nextDirection: 'asc' | 'desc' = isSameColumn && direction === 'asc' ? 'desc' : 'asc';

		navigate({
			resetScroll: false,
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
			resetScroll: false,
			search: (prev: SearchParams) => ({
				...prev,
				page: clampedNextPage,
			}),
		});
	};

	return (
		<>
			<div className="overflow-x-auto mb-3">
				<table className='w-full text-left text-base font-medium'>
					<thead className='bg-table-header font-semibold border-b-[2px] border-table-row-border tracking-wider'>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => { 
									
									let headerTitle = '';
									let sortStatus: 'none' | 'ascending' | 'descending' | undefined = undefined;

									if(header.column.getCanSort()) {

										if(!header.column.getIsSorted()) {

											headerTitle = `Sort by ${header.column.columnDef.header} ascending`;
											sortStatus = 'none';

										} else if(header.column.getIsSorted() === 'desc') {
										
											headerTitle = `Sort by ${header.column.columnDef.header} ascending`;
											sortStatus = 'descending';
										
										} else if(header.column.getIsSorted() === 'asc') {

											headerTitle = `Sort by ${header.column.columnDef.header} descending`;
											sortStatus = 'ascending';
										}
									}

									return (
										<th 
											key={header.id}
											className='p-3'
											aria-sort={sortStatus}
										>
											{header.column.getCanSort() &&
												<button 
													className='whitespace-nowrap flex gap-x-2 cursor-pointer'
													type="button"
													title={headerTitle}
													onClick={() => sortHandler(header.column.id)}
												>
													<table.FlexRender header={header} />
													{!header.column.getIsSorted() &&
														<img src={iconSortable} width={SORT_ICON_SIZE} aria-hidden="true" alt="" className='h-auto' />
													}
													{header.column.getIsSorted() === 'asc' &&
														<img src={iconSortedAsc} width={SORT_ICON_SIZE} aria-hidden="true" alt="" className='h-auto' />
													}
													{header.column.getIsSorted() === 'desc' &&
														<img src={iconSortedDesc} width={SORT_ICON_SIZE} aria-hidden="true" alt="" className='h-auto' />
													}
												</button>
											}
											{!header.column.getCanSort() &&
												<table.FlexRender header={header} />
											}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody className='divide-y divide-table-row-border'>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getAllCells().map((cell) => (
									<td 
										key={cell.id}
										className='p-3 text-table-body'
									>
										<table.FlexRender cell={cell} />
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='flex justify-between text-sm mb-5 p-3 text-table-body'>
				<span>
					Page <strong>{currentPage}</strong> of <strong>{numPages}</strong>
				</span>
				<div className='flex gap-x-2'>
					<button
						type="button"
						onClick={() => paginationClickHandler(currentPage - 1)}
						disabled={!table.getCanPreviousPage()}
						className='paginate'
					>
						Previous Page
					</button>
					<span aria-hidden="true">|</span>
					<button
						type="button"
						onClick={() => paginationClickHandler(currentPage + 1)}
						disabled={!table.getCanNextPage()}
						className='paginate'
					>
						Next Page
					</button>
				</div>
			</div>
		</>
	);
}
