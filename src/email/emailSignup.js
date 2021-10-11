const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
const { emailAddress } = require('../utils/emailAddress');

export default async function emailSignup(email, name) {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'welcome@MiniPainter3d.com',
          Name: 'MiniPainter3d',
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        Subject: 'Welcome to MiniPainter3d',
        TextPart: `It's great to have you on board, login and set up your profile here: ${emailAddress.appURL}`,
        HTMLPart: `<p>Welcome to MiniPainter3d,</p><p>It's great to have you on board, login and create your profile here:</p><p><strong><br/><a style="background:#ddd; border-radius:5px; text-decoration:none; padding:10px; color:#444; margin-top:10px; margin-bottom:10px;" href='${emailAddress.appURL}'>Let's Begin</a><br/><br/></strong></p><p>${emailAddress.signoffHTML}</p><p style="font-size:10px">If this was not you contact <a href='${emailAddress.tech}'>${emailAddress.tech}</a></p>`,
      },
    ],
  });
  return request;
}
