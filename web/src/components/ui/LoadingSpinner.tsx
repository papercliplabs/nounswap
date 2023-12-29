import Icon from "./Icon";

interface LoadingProps {
    size?: number;
}

export default function LoadingSpinner({ size }: LoadingProps) {
    return <Icon icon="pending" size={size ?? 60} className="flex w-full justify-center animate-spin" />;
}
