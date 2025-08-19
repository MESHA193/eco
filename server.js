const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static site from /pro
const staticDir = path.join(__dirname, 'pro');
app.use(express.static(staticDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

function buildTransport() {
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) {
    // If no SMTP configured, attempt sendmail (may not be available in all environments)
    return nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    });
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || 'true') === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host: smtpHost,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined
  });
}

function buildMailOptions(body) {
  const {
    name,
    phone,
    email,
    message,
    company,
    service,
    context,
    formType
  } = body || {};

  const toEmail = process.env.MAIL_TO || 'mafonin474@gmail.com';
  const fromEmail = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com';

  const subject = `Новая заявка (${formType || 'форма'}) с сайта ПРОЭКО`;

  const lines = [
    'Получена новая заявка с сайта ПРОЭКО',
    '',
    `Тип формы: ${formType || 'не указан'}`,
    `Имя: ${name || ''}`,
    `Телефон: ${phone || ''}`,
    `Email: ${email || ''}`,
    `Компания: ${company || ''}`,
    `Интересующая услуга: ${service || ''}`,
    '',
    'Сообщение:',
    message || '',
    '',
    'Контекст:',
    context ? JSON.stringify(context, null, 2) : '(нет)'
  ];

  const text = lines.join('\n');
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;line-height:1.5">
      <h2>Новая заявка с сайта ПРОЭКО</h2>
      <p><b>Тип формы:</b> ${formType || 'не указан'}</p>
      <p><b>Имя:</b> ${name || ''}</p>
      <p><b>Телефон:</b> ${phone || ''}</p>
      <p><b>Email:</b> ${email || ''}</p>
      <p><b>Компания:</b> ${company || ''}</p>
      <p><b>Интересующая услуга:</b> ${service || ''}</p>
      <p><b>Сообщение:</b><br>${(message || '').replace(/\n/g, '<br>')}</p>
      <hr>
      <p><b>Контекст:</b></p>
      <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:6px">${context ?
        (typeof context === 'string' ? context : JSON.stringify(context, null, 2)) : '(нет)'}
      </pre>
    </div>
  `;

  return {
    from: fromEmail,
    to: toEmail,
    subject,
    text,
    html
  };
}

app.post('/api/send-form', async (req, res) => {
  try {
    const { name, phone } = req.body || {};
    if (!name || !phone) {
      return res.status(400).json({ error: 'Не все обязательные поля заполнены (name, phone)' });
    }

    const transporter = buildTransport();
    const mailOptions = buildMailOptions(req.body);

    await transporter.verify().catch(() => {}); // ignore verify errors to not block send
    const info = await transporter.sendMail(mailOptions);

    return res.json({ ok: true, id: info && (info.messageId || info.response) });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Ошибка при отправке письма' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

