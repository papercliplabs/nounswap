import { Suspense } from "react";
import HowItWorksModal from "../../../../components/HowItWorks";
import LinkRetainParams from "../../../../components/LinkRetainParams";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default async function Layout({ children }: { children: React.ReactElement }) {
    return (
        <div className="flex flex-col w-full grow">
            <div className=" bg-gray-200">
                <div className="flex flex-row justify-between px-6 md:px-10 py-5">
                    <Suspense fallback={<LoadingSpinner />}>
                        <LinkRetainParams href="/">
                            <button className="btn-secondary">Back</button>
                        </LinkRetainParams>
                    </Suspense>
                    <HowItWorksModal />
                </div>
                <div className="flex flex-col justify-center items-center text-center pb-10 px-6 md:px-10">
                    <h1>Create a Swap Prop</h1>
                    <div>Select the Noun you want to offer for the Swap.</div>
                </div>
            </div>
            {children}
        </div>
    );
}
