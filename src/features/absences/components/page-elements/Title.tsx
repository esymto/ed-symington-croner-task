type Props = {
    text: String
}

export function Title({ text }: Props) {
    return (
        <h1>{text}</h1>
    );
}