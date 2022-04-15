import WithHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({ ok: true });
}

export default WithHandler("POST", handler);
