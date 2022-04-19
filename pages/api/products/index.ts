import client from "@libs/server/client";
import WithHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany({});
    res.json({
      ok: true,
      products,
    });
  }
  if (req.method === "POST") {
  }
}

export default withApiSession(
  WithHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
