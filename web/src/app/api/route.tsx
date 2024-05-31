import { getAllNouns } from "@/data/noun/getAllNouns";
import { time, timeEnd } from "console";

export async function GET() {
  time("test");
  const a = await getAllNouns();
  timeEnd("test");
  return Response.json(a);
}
