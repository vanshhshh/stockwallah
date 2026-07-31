import nodemailer from "nodemailer";
import { logger } from "../lib/logger.js";

const hasSmtp =
  Boolean(process.env.SMTP_HOST) &&
  Boolean(process.env.SMTP_USER) &&
  Boolean(process.env.SMTP_PASS) &&
  Boolean(process.env.NOTIFICATION_EMAIL);

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

type NotificationPayload = Record<string, string | number | null | undefined>;

function toHtml(payload: NotificationPayload) {
  const rows = Object.entries(payload)
    .map(([key, value]) => `<tr><td style="padding:6px 12px;color:#888">${key}</td><td style="padding:6px 12px"><strong>${value ?? "-"}</strong></td></tr>`)
    .join("");

  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#0A0A0A;color:#FAFAFA;padding:24px">
      <h2 style="color:#C9A84C;margin:0 0 16px">StockWallah Notification</h2>
      <table style="border-collapse:collapse;background:#111;border:1px solid #2A2A2A">${rows}</table>
    </div>
  `;
}

export async function sendAdminNotification(subject: string, payload: NotificationPayload) {
  if (!transporter) {
    logger.info("SMTP not configured; skipped notification email", { subject, payload });
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject,
    html: toHtml(payload),
  });
}
