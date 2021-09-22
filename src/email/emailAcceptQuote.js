const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
const { emailAddress } = require('../utils/emailAddress');

export default async function emailAcceptQuote(user, quoteDeets, sender) {
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
        Subject: `${sender.name} has ACCEPTED your quote`,
        TextPart: `Congratulations, ${sender.name} has ACCEPTED your quote on RandomShit: View the full quote at ${emailAddress.appURL}. ${emailAddress.signoffHTML}`,
        HTMLPart: `<p>Hi ${user.name},</p>
        <p>Congratulations, ${sender.name} has ACCEPTED your quote on RandomShit</p><p style='background:#57499e; padding:20px; border-radius:5px; font-size:20px; color:#fff; text-align:center; text-align:center'>${quoteDeets.cost} ${quoteDeets.currency}<br/>${quoteDeets.deadline}<br/>ACCEPTED</p><p>We'll let you know as soon as the Client has deposited the payment.</p><p>View the full quote at <a style="border-radius:5px; padding:10px; color:#57499e; font-weight:bold; margin-top:10px; margin-bottom:10px;" href='${emailAddress.appURL}'>RandomShit</a></p><p>${emailAddress.signoffHTML}</p>
        `,
      },
    ],
  });
  return request;
}
