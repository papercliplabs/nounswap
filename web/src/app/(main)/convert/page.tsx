// import { Proposals } from "./Proposals";

import Icon from "@/components/ui/Icon";
import Convert from "./Convert";
import ConvertInfo from "./ConvertInfo";

export default function ConvertPage() {
  return (
    <div className="flex w-full max-w-[1600px] flex-col justify-between gap-[55px] self-center md:flex-row">
      <div className="flex w-full flex-[7] flex-col gap-4">
        <div className="paragraph-sm flex gap-[10px] rounded-xl bg-yellow-100 p-4">
          <Icon icon="infoCircle" size={16} className="fill-content-primary shrink-0" />
          <span>The $nouns contracts are unaudited use at your own risk. </span>
        </div>
        <Convert />
      </div>
      <div className="flex w-full flex-[3]">
        <ConvertInfo />
      </div>
    </div>
  );
}
