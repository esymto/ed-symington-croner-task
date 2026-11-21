import { useEffect } from 'react';
import type { Absence } from '../schemas/absences';
import { absencesRoute } from '../routes/absences';

type Props = {
	data: Absence[];
};

export default function Table({ data }: Props) {

	const { sort, direction, page } = absencesRoute.useSearch();
	
	useEffect(() => {
		
		console.log(sort, direction, page);
		console.log(data);
	});

	return <></>;
}
