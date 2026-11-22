import './TypeLabel.css';

type Props = {
    text: String;
};

export default function Table({ text }: Props) {

    return <span className='label neutral'>{text}</span>;
}