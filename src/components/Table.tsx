import type { Absence } from '../api/absenses';

type Props = {
	data: Absence[];
};

export default function Table({ data }: Props) {

	console.log(data);

	return <></>;
}
