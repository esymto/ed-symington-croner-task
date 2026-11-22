import { useQuery } from '@tanstack/react-query';
import { conflictQueryOptions } from '../../queries';

type Props = {
	absenceId: number;
};

export default function ConflictCell({ absenceId }: Props) {

    const { data, isPending, isError } = useQuery(conflictQueryOptions(absenceId));

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
