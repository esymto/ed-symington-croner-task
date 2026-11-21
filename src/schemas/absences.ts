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
	absenceType: z.enum(['ANNUAL_LEAVE', 'SICKNESS', 'MEDICAL']).or(z.string()),
	employee: EmployeeSchema,
	approved: z.boolean()
});

export const AbsencesSchema = z.array(AbsenceSchema);
export type Absence = z.infer<typeof AbsenceSchema>;
export type Employee = z.infer<typeof EmployeeSchema>;
