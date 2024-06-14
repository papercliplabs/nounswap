import { getUserAvatar } from "@/data/user/getUserAvatar";
import { getAddress } from "viem";

// Unfortunte workaround for nextjs bug with server actions from tanstack
export async function GET(req: Request, { params }: { params: { address: string } }) {
  const address = getAddress(params.address);
  const avatar = await getUserAvatar(address);
  return Response.json(avatar);
}
