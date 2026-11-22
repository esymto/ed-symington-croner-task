import { useMemo } from 'react';
import type { Absence, SearchParams } from '../../schemas';
import { absencesRoute } from '../../../../routes/absences';
import { useTable, tableFeatures, type ColumnDef, type SortingState, rowSortingFeature, createSortedRowModel, sortFn_alphanumeric, sortFn_basic } from '@tanstack/react-table';
import ConflictCell from './ConflictCell';

type Props = {
	data: Absence[];
};

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
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

	const { sort, direction } = absencesRoute.useSearch();
	const navigate = absencesRoute.useNavigate();
	const sorting = useMemo<SortingState>(() => [{ id: sort, desc: direction === 'desc' }], [sort, direction]);
	
	if(!data.length) {
		return <p>No absences found.</p>
	}
	
	const table = useTable({
		features,
		columns,
		data,
		state: {
			sorting
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
		</>
	);
}
