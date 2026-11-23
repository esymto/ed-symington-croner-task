import Table from '../tables/Table';
import { Title } from '../page-elements/Title';
import { useSuspenseQuery } from '@tanstack/react-query';
import { absencesQueryOptions } from '../../queries';

export default function AbsencesPage() {

    const { data } = useSuspenseQuery(absencesQueryOptions());

    return (
        <>
            <Title text="Absences" />
            <Table data={data} />
        </>
    );
}
