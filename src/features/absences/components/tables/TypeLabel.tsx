type Props = {
    text: string;
};

export default function TypeLabel({ text }: Props) {

    return <span className='value-label neutral'>{text}</span>;
}