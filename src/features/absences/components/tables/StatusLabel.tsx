import './StatusLabel.css';

type Props = {
    approved: Boolean;
};

export default function Table({ approved }: Props) {

    return (
        <>
            {approved &&
                <span className='label approved'>Approved</span>
            }
            {!approved &&
                <span className='label'>Pending</span>
            }
        </>
    );
}