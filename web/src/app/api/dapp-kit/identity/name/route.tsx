import { getName, GetIdentityParametersSchema } from "@paperclip-labs/dapp-kit/identity/server";
import { HARDCODED_USERS, IDENTITY_API_CONFIG } from "../config";
import { SECONDS_PER_WEEK } from "@paperclip-labs/dapp-kit";
import { getAddress } from "viem";
import { safeUnstableCache } from "@/utils/safeFetch";

const getNameCached = safeUnstableCache(getName, ["get-user"], { revalidate: SECONDS_PER_WEEK });

export async function POST(req: Request) {
  const payload = await req.json();

  try {
    const parameters = GetIdentityParametersSchema.parse(payload);

    const hardcodedUser = HARDCODED_USERS[getAddress(parameters.address)];
    if (hardcodedUser) {
      return Response.json(hardcodedUser.name);
    }

    const name = await getNameCached(IDENTITY_API_CONFIG, parameters);
    return Response.json(name);
  } catch (error) {
    console.error("Invalid parameters:", error);
    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  }
}