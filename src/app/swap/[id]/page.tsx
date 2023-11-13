import { getNounById } from "@/common/dataFetch";
import HowItWorksModal from "@/components/HowItWorks";
import NounSwap from "@/components/NounSwap";
import Link from "next/link";

export default async function Swap({ params }: { params: { id: string } }) {
    const treasuryNoun = await getNounById(params.id);

    return (
        <div className="flex flex-col w-full grow">
            <div className=" bg-gray-200">
                <div className="flex flex-row justify-between px-10 py-5">
                    <Link href="/">
                        <button className="btn-secondary">Back</button>
                    </Link>
                    <HowItWorksModal />
                </div>
                <div className="flex flex-col justify-center items-center pb-10">
                    <h1>Create a Swap Prop</h1>
                    <div>Choose the Noun you want to swap for the Treasury Noun. </div>
                </div>
            </div>
            {treasuryNoun ? <NounSwap treasuryNoun={treasuryNoun} /> : `Treasury does not own noun ${params.id}`}
        </div>
    );
}
