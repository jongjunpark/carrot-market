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
    query: { id },
  } = req;
  const chat = await client.chat.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      chatMessages: true,
      user: {
        select: {
          avatar: true,
        },
      },
    },
  });
  res.json({
    ok: true,
    chat,
  });
}

export default withApiSession(
  WithHandler({
    methods: ["GET"],
    handler,
  })
);
