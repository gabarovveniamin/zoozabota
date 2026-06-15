import { neon } from '@neondatabase/serverless';
import { sendTelegramMessage } from '../../telegram-bot/bot.js';

export async function sendTelegramNotification(type: 'pet' | 'service', data: any) {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) {
    console.warn('[Telegram Notification] Database URL is not configured. Skipping notification.');
    return;
  }

  try {
    const sql = neon(databaseUrl);
    const subscribers = await sql`SELECT chat_id FROM telegram_subscribers`;
    
    if (subscribers.length === 0) {
      console.log('[Telegram Notification] No registered subscribers found.');
      return;
    }

    let text = '';
    if (type === 'pet') {
      text = 
        `🐾 *Новая заявка на добавление питомца!*\n\n` +
        `👤 *Имя:* ${data.name}\n` +
        `🐩 *Порода:* ${data.breed}\n` +
        `📅 *Годы жизни:* ${data.years}\n` +
        `🏷️ *Emoji:* ${data.emoji}\n` +
        `📧 *Email:* ${data.email || 'Не указан'}\n` +
        `📝 *Описание:* ${data.description || 'Нет описания'}\n` +
        `🖼️ *Фото:* ${data.photo ? 'Присутствует (в админ-панели)' : 'Отсутствует'}`;
    } else {
      text = 
        `🪦 *Новая заявка на памятник!*\n\n` +
        `🛍️ *Памятник:* ${data.service_title || data.serviceTitle}\n` +
        `👤 *Клиент:* ${data.name}\n` +
        `📞 *Телефон:* ${data.phone}\n` +
        `📧 *Email:* ${data.email || 'Не указан'}\n` +
        `💬 *Комментарий:* ${data.comment || 'Нет комментария'}`;
    }

    console.log(`[Telegram Notification] Sending to ${subscribers.length} subscribers...`);
    
    // Send message to all subscribers concurrently
    const promises = subscribers.map((sub) => 
      sendTelegramMessage(sub.chat_id, text)
    );
    
    await Promise.all(promises);
    console.log('[Telegram Notification] All notifications dispatched.');
  } catch (error) {
    console.error('[Telegram Notification] Failed to send notifications:', error);
  }
}
