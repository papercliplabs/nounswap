import { getCurrentAuctionNounId } from "@/data/auction/getCurrentAuctionNounId";

// Unfortunte workaround for nextjs bug with server actions from tanstack
export async function GET() {
  const currentAuctionId = await getCurrentAuctionNounId();
  return Response.json(currentAuctionId);
}
