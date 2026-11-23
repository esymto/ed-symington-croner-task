import TableSkeleton from '../tables/TableSkeleton';
import { Title } from '../page-elements/Title';

export default function AbsencesPageSkeleton() {
    return (
        <>
            <Title text="Absences" />
            <TableSkeleton />
        </>
    );
}
