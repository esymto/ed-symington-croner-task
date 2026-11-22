import { queryOptions } from '@tanstack/react-query';
import { getAbsences, getConflict } from './api';

export const absencesQueryOptions = () => queryOptions({
    queryKey: ['absences'],
    queryFn: getAbsences,
    staleTime: 1000 * 60 * 10
});

export const conflictQueryOptions = (absenceId: Number) => queryOptions({
    queryKey: ['conflict', absenceId],
    queryFn: () => getConflict(absenceId),
    staleTime: 1000 * 60 * 10
});
