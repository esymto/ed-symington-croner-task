import type { Absence } from '../schemas/absences';

type Props = {
	data: Absence[];
};

export default function Table({ data }: Props) {

	console.log(data);

	return <></>;
}
