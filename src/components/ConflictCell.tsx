import { useQuery } from '@tanstack/react-query';
import { getConflict } from '../api/absences';

type Props = {
	absenceId: number;
};

export default function ConflictCell({ absenceId }: Props) {

    // Cache conflict query for 10 minutes
    const { data, isPending, isError } = useQuery({
        queryKey: ['clashes', absenceId],
        queryFn: () => getConflict(absenceId),
        staleTime: 1000 * 60 * 10
    });

    return (
        <>
            {isPending &&
                <span>Loading</span>
            }
            {isError &&
                <span>Error</span>
            }
            {data !== undefined &&
                <span>{`${data.conflicts ? 'Yes' : 'No'}`}</span>
            }
        </>
    )
}
