import client from "@libs/server/client";
import WithHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const chat = await client.chat.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      product: {
        connect: {
          id: +id.toString(),
        },
      },
    },
  });
  res.json({ ok: true, chat });
}

export default withApiSession(
  WithHandler({
    methods: ["POST"],
    handler,
  })
);
