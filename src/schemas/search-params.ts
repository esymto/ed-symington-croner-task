import { z } from 'zod';

export const SortSchema = z.enum(['name', 'start', 'end', 'type']);
export const DirectionSchema = z.enum(['asc', 'desc']);

export const SearchParamsSchema = z.object({
	sort: SortSchema.catch('name'),
	direction: DirectionSchema.catch('asc'),
	page: z.number().int().positive().catch(1),
});
