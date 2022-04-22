import client from "@libs/server/client";
import WithHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;
  const chats = await client.chat.findMany({
    where: {
      userId: user?.id,
    },
  });
  res.json({
    ok: true,
    chats,
  });
}

export default withApiSession(
  WithHandler({
    methods: ["GET"],
    handler,
  })
);
