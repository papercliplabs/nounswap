import { getUserName } from "@/data/user/getUserName";
import { getAddress } from "viem";

// Unfortunte workaround for nextjs bug with server actions from tanstack
export async function GET(req: Request, { params }: { params: { address: string } }) {
  const address = getAddress(params.address);
  const name = await getUserName(address);
  return Response.json(name);
}
