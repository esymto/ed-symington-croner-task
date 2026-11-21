import { z } from 'zod';

export const SortSchema = z.enum(['employee', 'startDate', 'endDate', 'type']);
export const DirectionSchema = z.enum(['asc', 'desc']);

export const SearchParamsSchema = z.object({
	sort: SortSchema.catch('employee'),
	direction: DirectionSchema.catch('asc'),
	page: z.number().int().positive().catch(1),
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;