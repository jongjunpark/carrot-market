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
    body,
  } = req;
  const message = await client.message.create({
    data: {
      message: body.message,
      user: {
        connect: {
          id: user?.id,
        },
      },
      stream: {
        connect: {
          id: +id.toString(),
        },
      },
    },
  });
  res.json({ ok: true, message });
}

export default withApiSession(
  WithHandler({
    methods: ["POST"],
    handler,
  })
);
