import { getAuctionById } from "@/data/auction/getAuctionById";

// Unfortunte workaround for nextjs bug with server actions from tanstack
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auction = await getAuctionById(params.id);
  return Response.json(auction);
}
