import './TableSkeleton.css';

export default function TableSkeleton() {

    return (
        <>
            <p className="sr-only">Loading...</p>
            <div className="overflow-x-auto mb-3" aria-hidden="true">
                <table className="w-full text-left text-base font-medium">
                    <thead className="bg-table-header font-semibold border-b-[2px] border-table-row-border tracking-wider">
                        <tr>
                            {Array.from({ length: 6 }, (_, index) => (
                                <th 
                                    key={index} 
                                    className={`${index > 0 ? 'hidden md:table-cell ' : ''}p-3`}
                                >&nbsp;</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-table-row-border">
                        {Array.from({ length: 10 }, (_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: 6 }, (_, cellIndex) => (
                                    <td 
                                        key={cellIndex} 
                                        className={`${cellIndex > 0 ? 'hidden md:table-cell ' : ''}p-3`}
                                    >
                                        <div className="skeleton-bar relative overflow-hidden bg-skeleton rounded-full w-full h-5"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}