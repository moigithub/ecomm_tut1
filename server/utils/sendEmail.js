import nodemailer from 'nodemailer'

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD
    }
  })

  const body = `
  from : XXX noreply@gmail.com
  to: ${email}
  subject: ${subject}
  text: ${message}
  `

  await transporter.sendMail(body)
}
