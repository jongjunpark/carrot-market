import client from "@libs/server/client";
import WithHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
// import twilio from "twilio";
// import mail from "@sendgrid/mail";

// mail.setApiKey(process.env.SENDGRID_API_KEY!);
// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MESSAGE_SID,
    //   to: process.env.PHONE_NUMBER!,
    //   body: `Your login token is ${payload}`,
    // });
    // console.log(message, "message!");
  } else if (email) {
    // const email = await mail.send({
    //   from: "jay@knotehow.com",
    //   to: "jay@knotehow.com",
    //   subject: "Your Carrot Market Verification Email",
    //   text: `Your token is ${payload}`,
    //   html: `<string>Your token is ${payload}</strong>`,
    // });
  }
  return res.json({
    ok: true,
    token,
  });
}

export default WithHandler({
  methods: ["POST"],
  handler,
  isPrivate: false,
});
