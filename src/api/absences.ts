import { type Absence, type Conflict, ConflictSchema, AbsencesSchema } from "../schemas/absences";

export async function getAbsences(): Promise<Absence[]> {

	const response = await fetch('https://front-end-kata.brighthr.workers.dev/api/absences');

	if (!response.ok) {
		throw new Error(`Failed to fetch absences: ${response.status}`);
	}

	const data: unknown = await response.json();

	return AbsencesSchema.parse(data);
}

export async function getConflict(absenceId: Number): Promise<Conflict> {

	const response = await fetch(`https://front-end-kata.brighthr.workers.dev/api/conflict/${absenceId}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch conflict: ${response.status}`);
	}

	const data: unknown = await response.json();

	return ConflictSchema.parse(data);
}
