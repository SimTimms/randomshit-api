const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
const { emailAddress } = require('../utils/emailAddress');

export default async function emailInvite(user, jobDeets) {
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
        Subject: `You've got an invite`,
        TextPart: `You have been asked to provide a quote for "${jobDeets.name}"`,
        HTMLPart: `<p>Hi ${user.name},</p>
        <p>You have been asked to provide a quote for "${jobDeets.name}"</p><p style='background:#57499e; padding:20px; border-radius:5px; font-size:20px; color:#fff; text-align:center;'>${jobDeets.summary}</p><p>Check in at <a style="background:#ddd; border-radius:5px; text-decoration:none; padding:10px; color:#444; margin-top:10px; margin-bottom:10px;" href='${process.env.EMAIL_URL}'>RandomShit</a></p><p>${emailAddress.signoffHTML}</p>
        `,
      },
    ],
  });
  return request;
}
