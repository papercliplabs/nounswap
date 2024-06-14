import { getNounById } from "@/data/noun/getNounById";

// Unfortunte workaround for nextjs bug with server actions from tanstack
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auction = await getNounById(params.id);
  return Response.json(auction);
}
