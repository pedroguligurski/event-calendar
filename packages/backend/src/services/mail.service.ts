import nodemailer from 'nodemailer'
import { env } from '../env.js'

const isSmtpConfigured = (): boolean => {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass)
}

const transporter = isSmtpConfigured()
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    })
  : null

export const mailService = {
  isConfigured(): boolean {
    return transporter !== null
  },

  async sendMagicLinkEmail(to: string, magicLink: string): Promise<void> {
    if (!transporter) {
      throw new Error('SMTP transporter is not configured.')
    }

    await transporter.sendMail({
      from: env.mailFrom,
      to,
      subject: 'Seu link de acesso ao CWB Connect',
      text: `Use este link para entrar na sua conta: ${magicLink}`,
      html: `
        <p>Use este link para entrar na sua conta no CWB Connect:</p>
        <p><a href="${magicLink}">${magicLink}</a></p>
        <p>Se voce nao solicitou este acesso, ignore este e-mail.</p>
      `,
    })
  },
}
