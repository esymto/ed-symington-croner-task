import { useQuery } from '@tanstack/react-query';
import { getAbsences } from '../api/absences';
import Table from './Table';

export default function Absences() {

	// Cache main query for 10 minutes
	const { data, isPending, isError, error } = useQuery({
		queryKey: ['absences'],
		queryFn: getAbsences,
		staleTime: 1000 * 60 * 10
	});

	return (
		<>
			<h1>Absences</h1>
			{isPending &&
				<p>Loading...</p>
			}
			{isError &&
				<p>Error: {error.message}</p>
			}
			{data !== undefined &&
				<Table data={data} />
			}
		</>
	);
}
