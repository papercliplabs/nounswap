"use client";
import { encodeFunctionData, Hex } from "viem";
import {
  UseSendTransactionReturnType,
  useSendTransaction,
} from "./useSendTransaction";
import { useCallback } from "react";

import { CustomTransactionValidationError } from "./types";
import { useAccount } from "wagmi";
import { multicall } from "viem/actions";
import { CHAIN_CONFIG } from "@/config";
import { nounsDaoLogicConfig } from "@/data/generated/wagmi";
import { CLIENT_ID } from "@/utils/constants";

interface UseCastRefundableVoteReturnType
  extends Omit<UseSendTransactionReturnType, "sendTransaction"> {
  castRefundableVote: (
    proposalId: number,
    vote: "for" | "against" | "abstain",
    reason?: string,
  ) => void;
}

export function useCastRefundableVote(): UseCastRefundableVoteReturnType {
  const { sendTransaction, ...other } = useSendTransaction();
  const { address } = useAccount();

  const castRefundableVoteValidation = useCallback(
    async (
      proposalId: number,
      vote: "for" | "against" | "abstain",
      reason?: string,
    ): Promise<CustomTransactionValidationError | null> => {
      if (!address) {
        // Never should get here, since sendTransaction enforces connected
        return new CustomTransactionValidationError(
          "NOT_CONNECTED",
          "Wallet not connected.",
        );
      }

      const [{ hasVoted }] = await multicall(CHAIN_CONFIG.publicClient, {
        contracts: [
          {
            ...nounsDaoLogicConfig,
            functionName: "getReceipt",
            args: [BigInt(proposalId), address],
          },
        ],
        allowFailure: false,
      });

      if (hasVoted) {
        return new CustomTransactionValidationError(
          "ALREADY_VOTED",
          "Address has already voted.",
        );
      }

      return null;
    },
    [address],
  );

  const castRefundableVote = useCallback(
    (
      proposalId: number,
      vote: "for" | "against" | "abstain",
      reason?: string,
    ) => {
      let data: Hex;
      if (reason && reason != "") {
        data = encodeFunctionData({
          abi: nounsDaoLogicConfig.abi,
          functionName: "castRefundableVoteWithReason",
          args: [
            BigInt(proposalId),
            vote == "abstain" ? 0 : vote == "for" ? 1 : 2,
            reason,
            CLIENT_ID,
          ],
        });
      } else {
        data = encodeFunctionData({
          abi: nounsDaoLogicConfig.abi,
          functionName: "castRefundableVote",
          args: [
            BigInt(proposalId),
            vote == "abstain" ? 0 : vote == "for" ? 1 : 2,
            CLIENT_ID,
          ],
        });
      }

      const request = {
        to: nounsDaoLogicConfig.address,
        data,
        value: BigInt(0),
        gasFallback: BigInt(500000), // Vote generally ~400k
      };

      return sendTransaction(
        request,
        { type: "cast-vote", description: `Cast vote on prop ${proposalId}` },
        () => castRefundableVoteValidation(proposalId, vote, reason),
      );
    },
    [sendTransaction, castRefundableVoteValidation],
  );

  return { castRefundableVote, ...other };
}
