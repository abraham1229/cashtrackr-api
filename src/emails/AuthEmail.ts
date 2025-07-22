// import { transport } from "../config/nodemailer"
import sgMail from "../config/sendgrid"

type EmailType = {
  name: string
  email: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    const msg = {
      to: user.email,
      from: 'CashTrackr <abrahamortizcastro1229@gmail.com>',
      subject: 'CashTrackr - Confirm your account',
      html: `<p>Hi ${user.name}, you have created your CashTrackr account. You are almost done!</p>
        <p>Follow the link below:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm account</a>
        <p> Enter the code: <b>${user.token}</b><p>`,
    }

    await sgMail.send(msg)
  }

  static sendPasswordResetToken = async (user: EmailType) => {
    const msg = {
      to: user.email,
      from: 'CashTrackr <abrahamortizcastro1229@gmail.com>',
      subject: 'CashTrackr - Reset your password',
      html: `<p>Hi ${user.name}, here is your reset code: <b>${user.token}</b></p>`,
    }

    await sgMail.send(msg)
  }
}