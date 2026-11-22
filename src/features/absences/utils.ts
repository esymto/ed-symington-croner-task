function isWeekday(date: Date): boolean {

	const day = date.getDay();
	return day !== 0 && day !== 6;
}

export function getEndDateExcludingWeekends(startDate: string | Date, days: number): Date {

	const endDate = new Date(startDate);

	if (days < 1) {
		return endDate;
	}

	let counted = isWeekday(endDate) ? 1 : 0;

	while (counted < days) {

		endDate.setDate(endDate.getDate() + 1);

		if (isWeekday(endDate)) {
			counted++;
		}
	}

	return endDate;
}
