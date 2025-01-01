"use client";
import NumberFlow from "@number-flow/react";
import { useInView } from "framer-motion";
import { useMemo, useRef } from "react";

interface ByTheNumbersDataProps {
  nounsCreated: number;
  nounOwners: number;
  ideasFunded: number;
  treasuryDeployedUsd: number;
}

export default function ByTheNumbersData({
  nounsCreated,
  nounOwners,
  ideasFunded,
  treasuryDeployedUsd,
}: ByTheNumbersDataProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [
    nounsCreatedInternal,
    nounOwnersInternal,
    ideasFundedInternal,
    treasuryDeployedUsdInternal,
  ] = useMemo(() => {
    return isInView
      ? [nounsCreated, nounOwners, ideasFunded, treasuryDeployedUsd]
      : [0, 0, 0, 0];
  }, [nounsCreated, nounOwners, ideasFunded, treasuryDeployedUsd, isInView]);

  return (
    <div
      className="grid grid-cols-2 grid-rows-2 gap-12 md:grid-cols-4 md:grid-rows-1 md:gap-[160px]"
      ref={ref}
    >
      <Metric label="Nouns Created" value={nounsCreatedInternal} />
      <Metric label="Noun Owners" value={nounOwnersInternal} />
      <Metric label="Ideas Funded" value={ideasFundedInternal} />
      <Metric
        label="Funded (USD)"
        value={treasuryDeployedUsdInternal}
        unit="$"
      />
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="flex w-fit flex-col items-center justify-center gap-2 place-self-center text-center md:gap-4">
      <span className="heading-2">
        {unit}
        <NumberFlow
          value={value}
          format={{
            notation: value > 9999 || value < -9999 ? "compact" : "standard",
          }}
        />
      </span>
      <span className="text-content-secondary label-md">{label}</span>
    </div>
  );
}
