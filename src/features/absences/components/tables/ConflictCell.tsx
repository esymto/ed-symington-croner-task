import { useQuery } from '@tanstack/react-query';
import { conflictQueryOptions } from '../../queries';
import iconTick from '../../../../assets/images/icons/tick.svg';
import iconX from '../../../../assets/images/icons/x.svg';
import iconError from '../../../../assets/images/icons/error.svg';

type Props = {
	absenceId: number;
};

const ICON_SIZE = 18;

export default function ConflictCell({ absenceId }: Props) {

    const { data, isPending, isError } = useQuery(conflictQueryOptions(absenceId));

    return (
        <>
            {isPending &&
                <>
                    <span className='sr-only'>Loading conflicts</span>
                    <span>...</span>
                </>
            }
            {isError &&
                <>
                    <span className='sr-only'>Error loading conflict information</span>
                    <img src={iconError} width={ICON_SIZE} height={ICON_SIZE} aria-hidden="true" alt="" title="Error loading conflict information" />
                </>
            }
            {data !== undefined && (
                data.conflicts ? (
                    <>
                        <span className='sr-only'>Absence has conflicts</span>
                        <img src={iconTick} width={ICON_SIZE} height={ICON_SIZE} aria-hidden="true" alt="" title="Absence has conflicts" />
                    </>
                ) : (
                    <>
                        <span className='sr-only'>Absence doesn't have any conflicts</span>
                        <img src={iconX} width={ICON_SIZE} height={ICON_SIZE} aria-hidden="true" alt="" title="Absence doesn't have any conflicts" />
                    </>
                )
            )}
        </>
    );
}
