import { promises as fs } from "fs";

export async function GET() {
  const file = await fs.readFile(
    process.cwd() + "/public/data/table.json",
    "utf8"
  );
  let data = JSON.parse(file);
  return Response.json(data);
}
