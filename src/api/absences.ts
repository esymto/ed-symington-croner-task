import { type Absence, AbsencesSchema } from "../schemas/absences";

export async function getAbsences(): Promise<Absence[]> {

	const response = await fetch('https://front-end-kata.brighthr.workers.dev/api/absences');

	if (!response.ok) {
		throw new Error(`Failed to fetch absences: ${response.status}`);
	}

	const data: unknown = await response.json();

	return AbsencesSchema.parse(data);
}
