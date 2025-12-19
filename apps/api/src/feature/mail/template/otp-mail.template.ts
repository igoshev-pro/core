interface OtpMailProps {
  email: string;
  name?: string;
  otp: string;
  company?: string;
  logoUrl?: string;
  primaryColor?: string;
  language?: 'ru' | 'en';
}

export const otpMailTemplate = ({
  email,
  name,
  otp,
  company = 'Igoshev PRO',
  logoUrl = 'https://api.igoshev.de/logo-core.png',
  primaryColor = '#22C55E',
  language = 'ru',
}: OtpMailProps) => {
  const greeting =
    language === 'ru'
      ? `Здравствуйте, ${name || email}!`
      : `Hello, ${name || email}!`;

  const introText =
    language === 'ru'
      ? 'Используйте код ниже для входа в панель управления:'
      : 'Use the code below to log in to the dashboard:';

  const footerText =
    language === 'ru'
      ? `Если вы не запрашивали этот код, просто проигнорируйте это письмо.`
      : `If you didn’t request this code, please ignore this email.`;

  return {
    to: email,
    from: process.env.EMAIL_FROM || 'support@igoshev.pro',
    subject:
      language === 'ru'
        ? `Код для входа в панель управления ${company}`
        : `Your ${company} login code`,
    html: `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0; padding:0; background:#ffffff; font-family: Arial, sans-serif;">
        <tr>
          <td align="center" style="padding: 20px; background: ${primaryColor};">
            <img src="${logoUrl}" alt="${company}" height="50" style="display:block;">
          </td>
        </tr>
        <tr>
          <td style="padding: 30px; font-size: 16px; color: #333;">
            <p style="margin:0 0 16px 0;">${greeting}</p>
            <p style="margin:0 0 24px 0;">${introText}</p>
            <p style="font-size: 28px; font-weight: bold; text-align: center; margin: 0 0 24px 0; letter-spacing: 4px; color: ${primaryColor};">
              ${otp}
            </p>
            <p style="margin:0; font-size: 14px; color:#666;">${footerText}</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px; font-size: 12px; color: #999;">
            © ${new Date().getFullYear()} ${company}. Все права защищены.
          </td>
        </tr>
      </table>
    `,
  };
};
