export type Employee = {
	id: string;
	firstName: string;
	lastName: string;
}

export type Absence = {
	id: number;
	startDate: string;
	days: number;
	absenceType: 'ANNUAL_LEAVE' | 'SICKNESS' | 'MEDICAL' | string;
	employee: Employee;
	approved: boolean;
};

export async function getAbsences(): Promise<Absence[]> {

	const response = await fetch('https://front-end-kata.brighthr.workers.dev/api/absences');

	if (!response.ok) {
		throw new Error(`Failed to fetch absences: ${response.status}`);
	}

	return response.json();
}
