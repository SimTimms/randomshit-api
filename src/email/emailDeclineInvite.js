const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
const { emailAddress } = require('../utils/emailAddress');

export default async function emailDeclineInvite(user, creative) {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: emailAddress.noreply,
          Name: 'MiniPainter3d',
        },
        To: [
          {
            Email: user.email,
            Name: user.name,
          },
        ],
        Subject: `${creative.name} has declined your invite`,
        TextPart: `${creative.name} has declined your invite on MiniPainter3d: View your project at ${emailAddress.appURL}. ${emailAddress.signoffHTML}`,
        HTMLPart: `<p>Hi ${user.name},</p>
        <p>${creative.name} has declined your invite on MiniPainter3d</p><p>View your project at <a style="border-radius:5px; padding:10px; color:#57499e; font-weight:bold; margin-top:10px; margin-bottom:10px;" href='${emailAddress.appURL}'>MiniPainter3d</a></p><p>${emailAddress.signoffHTML}</p>
        `,
      },
    ],
  });
  return request;
}
