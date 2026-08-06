import nodemailer from 'nodemailer';
import { db } from '../../db';
import { config } from '../../config';
import type { ContactInput } from './contact.schema';

export class ContactService {
  /**
   * Simpan pesan ke MySQL database & kirim notifikasi email via Nodemailer/SMTP
   */
  static async processContactMessage(data: ContactInput, ipAddress?: string) {
    // 1. Simpan ke database MySQL via Prisma
    const savedMessage = await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        ipAddress: ipAddress || 'unknown'
      }
    });

    // 2. Kirim email notifikasi secara async (non-blocking jika SMTP tidak dikonfigurasi)
    this.sendNotificationEmail(savedMessage).catch((err) => {
      console.warn('⚠️ Gagal mengirim email notifikasi kontak:', err.message);
    });

    return savedMessage;
  }

  /**
   * Helper Pengiriman Email Notifikasi Admin
   */
  private static async sendNotificationEmail(messageData: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date;
  }) {
    // Jika SMTP HOST tidak diisi di env, skip pengiriman email dengan log halus
    if (!config.SMTP_HOST) {
      console.log(`ℹ️ [Email Notification Skipped] Pesan dari ${messageData.email} tersimpan di DB.`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: config.SMTP_USER
        ? {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS
          }
        : undefined
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Pesan Baru dari Website Portfolio</h2>
        <p><strong>Nama:</strong> ${messageData.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${messageData.email}">${messageData.email}</a></p>
        <p><strong>Subjek:</strong> ${messageData.subject}</p>
        <p><strong>Waktu:</strong> ${messageData.createdAt.toLocaleString('id-ID')}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 16px 0;" />
        <p><strong>Isi Pesan:</strong></p>
        <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #2563eb; white-space: pre-wrap;">${messageData.message}</div>
      </div>
    `;

    await transporter.sendMail({
      from: config.SMTP_FROM,
      to: config.ADMIN_EMAIL,
      replyTo: messageData.email,
      subject: `[Portfolio Contact] ${messageData.subject}`,
      html: htmlContent
    });

    console.log(`✅ Email notifikasi terkirim ke ${config.ADMIN_EMAIL}`);
  }
}
