import { getNounById } from "@/common/dataFetch";
import NounSwap from "@/components/NounSwap";

export default async function Swap({ params }: { params: { id: string } }) {
    const treasuryNoun = await getNounById(params.id);

    return (
        <div className="flex flex-col w-full grow">
            Swap with Treasure
            {treasuryNoun ? <NounSwap treasuryNoun={treasuryNoun} /> : `Treasury does not own noun ${params.id}`}
        </div>
    );
}
