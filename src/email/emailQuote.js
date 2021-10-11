const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
const { emailAddress } = require('../utils/emailAddress');

export default async function emailQuote(user, quoteDeets, sender) {
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
        Subject: `${sender.name} has responded to your job on MiniPainter3d`,
        TextPart: `${sender.name} has responded to your job on MiniPainter3d: ${quoteDeets.cost} ${quoteDeets.currency}, ${quoteDeets.deadline}. View the full quote at ${emailAddress.appURL}. ${emailAddress.signoffHTML}`,
        HTMLPart: `<p>Hi ${user.name},</p>
        <p>${sender.name} has responded to your job on MiniPainter3d</p><p style='background:#57499e; padding:20px; border-radius:5px; font-size:20px; color:#fff; text-align:center; text-align:center'>${quoteDeets.cost} ${quoteDeets.currency}<br/>${quoteDeets.deadline}</p><p>View the full quote at <a style="border-radius:5px; padding:10px; color:#57499e; font-weight:bold; margin-top:10px; margin-bottom:10px;" href='${emailAddress.appURL}'>MiniPainter3d</a></p><p>${emailAddress.signoffHTML}</p>
        `,
      },
    ],
  });
  return request;
}
