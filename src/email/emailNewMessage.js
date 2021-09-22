const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
const { emailAddress } = require('../utils/emailAddress');

export default async function emailNewMessage(user, subject) {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: emailAddress.noreply,
          Name: 'RandomShit',
        },
        To: [
          {
            Email: user.email,
            Name: user.name,
          },
        ],
        Subject: subject,
        TextPart: `There's a message waiting for you on Doodle Meeple"`,
        HTMLPart: `<p>Hi ${user.name},</p>
        <p>There's a message waiting for you on Doodle Meeple!
        </p><p style='background:#57499e; padding:20px; border-radius:5px; font-size:20px; color:#fff; text-align:center; text-align:center;'>1 New Message
        </p><p>Login at <a style="background:#ddd; border-radius:5px; text-decoration:none; padding:10px; color:#444; margin-top:10px; margin-bottom:10px;" href='${emailAddress.messagesURL}'>${emailAddress.messagesURL}</a></p><p>${emailAddress.signoffHTML}</p>
        `,
      },
    ],
  });
  return request;
}
