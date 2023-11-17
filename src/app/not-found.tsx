import LinkRetainParams from "@/components/LinkRetainParams";

export default function NotFound() {
    return (
        <div className="flex flex-col grow justify-center items-center">
            <h2>404 - Not Found</h2>
            <p>Could not find requested resource</p>
            <LinkRetainParams href="/">Return Home</LinkRetainParams>
        </div>
    );
}
