import { Suspense } from "react";
import { LinkInternal } from "@/components/ui/link";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function NotFound() {
    return (
        <div className="flex flex-col grow justify-center items-center">
            <h2>404 - Not Found</h2>
            <p>Could not find requested resource</p>
            <Suspense fallback={<LoadingSpinner />}>
                <LinkInternal href="/">Return Home</LinkInternal>
            </Suspense>
        </div>
    );
}
