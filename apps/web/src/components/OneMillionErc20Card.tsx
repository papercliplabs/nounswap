import Image from "next/image";

export function OneMillionErc20Card() {
  return (
    <div className="bg-background-secondary flex h-[160px] w-[160px] flex-col items-center justify-center gap-4 rounded-[20px] p-4">
      <Image src="/erc-20-nouns-ethereum.png" width={64} height={64} alt="$nouns" className="h-16 w-16" />
      <h6>1,000,000 $nouns</h6>
    </div>
  );
}
