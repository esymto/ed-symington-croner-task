import { z } from 'zod';

export const EmployeeSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string()
});

export const AbsenceSchema = z.object({
	id: z.number(),
	startDate: z.string(),
	days: z.number(),
	absenceType: z.enum(['ANNUAL_LEAVE', 'SICKNESS', 'MEDICAL']),
	employee: EmployeeSchema,
	approved: z.boolean()
});

export const SortSchema = z.enum(['employee', 'startDate', 'endDate', 'type']);
export const DirectionSchema = z.enum(['asc', 'desc']);

export const SearchParamsSchema = z.object({
	sort: SortSchema.catch('employee'),
	direction: DirectionSchema.catch('asc'),
	page: z.number().int().positive().catch(1),
});

export const ConflictSchema = z.object({
	conflicts: z.boolean()
});

export const AbsencesSchema = z.array(AbsenceSchema);
export type Absence = z.infer<typeof AbsenceSchema>;
export type Employee = z.infer<typeof EmployeeSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type Conflict = z.infer<typeof ConflictSchema>;
