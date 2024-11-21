import { getAvatar, GetIdentityParametersSchema } from "@paperclip-labs/dapp-kit/identity/server";
import { HARDCODED_USERS, IDENTITY_API_CONFIG } from "../config";
import { unstable_cache } from "next/cache";
import { SECONDS_PER_WEEK } from "@paperclip-labs/dapp-kit";
import { getAddress } from "viem";

const getAvatarCached = unstable_cache(getAvatar, ["get-avatar"], { revalidate: SECONDS_PER_WEEK });

export async function POST(req: Request) {
  const payload = await req.json();

  try {
    const parameters = GetIdentityParametersSchema.parse(payload);

    const hardcodedUser = HARDCODED_USERS[getAddress(parameters.address)];
    if (hardcodedUser) {
      return Response.json(hardcodedUser.imageSrc);
    }
    const avatar = await getAvatarCached(IDENTITY_API_CONFIG, parameters);
    return Response.json(avatar);
  } catch (error) {
    console.error("Invalid parameters:", error);
    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  }
}
