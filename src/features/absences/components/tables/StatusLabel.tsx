type Props = {
    approved: boolean;
};

export default function StatusLabel({ approved }: Props) {

    return (
        <>
            {approved &&
                <span className='value-label approved'>Approved</span>
            }
            {!approved &&
                <span className='value-label'>Pending</span>
            }
        </>
    );
}