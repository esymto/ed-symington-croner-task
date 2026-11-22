type Props = {
    text: String
}

export function Title({ text }: Props) {
    return (
        <h1 className="text-4xl font-semibold mb-8">{text}</h1>
    );
}