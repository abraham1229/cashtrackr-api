import { transport } from "../config/nodemailer"

type EmailType = {
  name: string
  email: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: 'CashTrackr <demomailtrap.com>',
      to: user.email,
      subject: 'CashTrackr - Confirm your account',
      html: `<p>Hi ${user.name}, you have created you CashTrackr account, you are almost done!</p>
        <p>Follow the link below:</p>
        <a href="#">Confirm account</a>
        <p> Enter the code: <b>${user.token}</b><p>`
    })
    // console.log('Mensaje enviado',email.messageId)
  }

  static sendPasswordResetToken = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: 'CashTrackr <demomailtrap.com>',
      to: user.email,
      subject: 'CashTrackr - Reset token',
      html: `<p>Hi ${user.name}, you have requested to reset your password.</p>
        <p>Follow the link below:</p>
        <a href="#">Reset password</a>
        <p> Enter the code: <b>${user.token}</b><p>`
    })
    // console.log('Mensaje enviado',email.messageId)
  }
}