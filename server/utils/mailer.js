const nodemailer = require("nodemailer");
const dotenv = require("../config/dotenv");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: dotenv.EMAIL_HOST,
  port: dotenv.EMAIL_PORT,
  secure: true,
  auth: {
    user: dotenv.EMAIL,
    pass: dotenv.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, title, message }) => {
  const mailOptions = {
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; color: #4A90E2; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4A90E2; font-size: 24px; margin: 0;">
            Hendrius Félix
          </h1>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h2 style="color: #4A90E2; font-size: 20px; margin: 0 0 10px; text-align: center;">
            <strong>${title}</strong>
          </h2>

          <h1 style="color: #0d9757; font-size: 22px; margin-bottom: 10px;">Mensagem:</h1>
          <p style="font-size: 16px; color: #555; background-color: #f4f4f4; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
            ${message}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #777; font-size: 14px;">
          <p>Este e-mail foi gerado automaticamente. Por favor, não responda.</p>
        </div>
      </div>
      `,
  };

  try {
    const mail = await transporter.sendMail(mailOptions);
    return mail;
  } catch (error) {
    logger.error("email", "Erro ao enviar email: ", error);
    console.error("Erro ao enviar e-mail: ", error);
    throw new Error(`Erro ao enviar e-mail: ${error.message}\nDetalhes: ${error.stack}`);
  }
};

module.exports = {
  sendEmail,
};
