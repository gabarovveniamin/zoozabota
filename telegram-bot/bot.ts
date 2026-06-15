import { neon } from '@neondatabase/serverless';

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminPassword = process.env.ADMIN_PASSWORD || 'ZooZabota2026!';
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!token) {
  console.warn('WARNING: TELEGRAM_BOT_TOKEN is not defined in environment variables.');
}

if (!databaseUrl) {
  console.warn('WARNING: DATABASE_URL (or POSTGRES_URL) is not defined in environment variables.');
}

const sql = databaseUrl ? neon(databaseUrl) : null;

// Ensure telegram_subscribers table exists
if (sql) {
  sql`
    CREATE TABLE IF NOT EXISTS telegram_subscribers (
      chat_id BIGINT PRIMARY KEY,
      username VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `.catch(err => {
    console.error('Failed to automatically create telegram_subscribers table on startup:', err);
  });
}

// Helper to send a message via Telegram API
export async function sendTelegramMessage(chatId: number | string, text: string, parseMode: 'Markdown' | 'HTML' = 'Markdown') {
  if (!token) {
    console.error('Telegram Bot token is not configured.');
    return false;
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode,
      }),
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error(`Failed to send message to ${chatId}:`, errText);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error sending message to ${chatId}:`, error);
    return false;
  }
}

// Check if subscriber exists in database
async function isSubscribed(chatId: number): Promise<boolean> {
  if (!sql) return false;
  try {
    const rows = await sql`SELECT 1 FROM telegram_subscribers WHERE chat_id = ${chatId} LIMIT 1`;
    return rows.length > 0;
  } catch (err) {
    console.error('Error checking subscription:', err);
    return false;
  }
}

// Add subscriber to database
async function addSubscriber(chatId: number, username: string | null): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql`
      INSERT INTO telegram_subscribers (chat_id, username, created_at)
      VALUES (${chatId}, ${username}, NOW())
      ON CONFLICT (chat_id) 
      DO UPDATE SET username = ${username}
    `;
    return true;
  } catch (err) {
    console.error('Error adding subscriber:', err);
    return false;
  }
}

// Remove subscriber from database
async function removeSubscriber(chatId: number): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql`DELETE FROM telegram_subscribers WHERE chat_id = ${chatId}`;
    return true;
  } catch (err) {
    console.error('Error removing subscriber:', err);
    return false;
  }
}

// Process updates from Telegram
export async function processUpdate(update: any) {
  if (!update || !update.message) return;

  const message = update.message;
  const chatId = message.chat?.id;
  const username = message.chat?.username || null;
  const text = message.text?.trim();

  if (!chatId || !text) return;

  // Split text into command and arguments
  const parts = text.split(/\s+/);
  const command = parts[0].toLowerCase();
  const arg = parts[1];

  switch (command) {
    case '/start':
      await sendTelegramMessage(
        chatId,
        `👋 *Добро пожаловать в бот уведомлений ZooZabota!*\n\n` +
        `Этот бот отправляет уведомления о новых заявках на добавление питомцев и о заказах памятников.\n\n` +
        `🔒 Для получения уведомлений необходимо авторизоваться:\n` +
        `Отправьте команду: \`/auth <пароль>\``
      );
      break;

    case '/auth':
      if (!arg) {
        await sendTelegramMessage(chatId, `❌ Пожалуйста, укажите пароль: \`/auth <пароль>\``);
        break;
      }

      if (arg === adminPassword) {
        if (!sql) {
          await sendTelegramMessage(
            chatId,
            `⚠️ *Ошибка подключения к базе данных*\n\nВ файле \`.env\` (или в переменных окружения) не задана переменная \`DATABASE_URL\` или \`POSTGRES_URL\` для подключения к базе данных Neon. Пожалуйста, добавьте её и перезапустите бота.`
          );
          break;
        }
        const success = await addSubscriber(chatId, username);
        if (success) {
          await sendTelegramMessage(chatId, `✅ *Авторизация успешна!*\n\nВы успешно подписаны на уведомления от ZooZabota.`);
        } else {
          await sendTelegramMessage(chatId, `❌ Произошла ошибка при регистрации в базе данных. Пожалуйста, проверьте консоль бота.`);
        }
      } else {
        await sendTelegramMessage(chatId, `❌ Неверный пароль. Попробуйте еще раз.`);
      }
      break;

    case '/unsubscribe': {
      const success = await removeSubscriber(chatId);
      if (success) {
        await sendTelegramMessage(chatId, `🔔 Вы успешно отписались от уведомлений.`);
      } else {
        await sendTelegramMessage(chatId, `❌ Произошла ошибка. Пожалуйста, попробуйте позже.`);
      }
      break;
    }

    case '/status': {
      const authorized = await isSubscribed(chatId);
      if (!authorized) {
        await sendTelegramMessage(chatId, `🔒 Вы не авторизованы. Отправьте \`/auth <пароль>\` для авторизации.`);
        break;
      }

      if (!sql) {
        await sendTelegramMessage(chatId, `⚠️ База данных не подключена.`);
        break;
      }

      try {
        const petRequestsCountResult = await sql`SELECT COUNT(*)::int as count FROM pet_requests WHERE status = 'pending'`;
        const serviceRequestsCountResult = await sql`SELECT COUNT(*)::int as count FROM service_requests WHERE status = 'pending'`;

        const petCount = petRequestsCountResult[0]?.count ?? 0;
        const serviceCount = serviceRequestsCountResult[0]?.count ?? 0;

        await sendTelegramMessage(
          chatId,
          `📊 *Статус уведомлений ZooZabota*\n\n` +
          `Вы авторизованы и подписаны на рассылку уведомлений.\n\n` +
          `⏳ *Ожидают обработки в админ-панели:*\n` +
          `• Заявки на питомцев: *${petCount}*\n` +
          `• Заявки на памятники: *${serviceCount}*`
        );
      } catch (err) {
        console.error('Error fetching statistics for status command:', err);
        await sendTelegramMessage(chatId, `⚠️ Не удалось загрузить статистику из базы данных.`);
      }
      break;
    }

    case '/help':
      await sendTelegramMessage(
        chatId,
        `🤖 *Доступные команды:*\n\n` +
        `/start - Начать работу и получить инструкцию\n` +
        `/auth <пароль> - Авторизоваться и подписаться на уведомления\n` +
        `/unsubscribe - Отписаться от уведомлений\n` +
        `/status - Проверить статус подписки и статистику заявок\n` +
        `/help - Показать этот список команд`
      );
      break;

    default:
      // If user is already subscribed, show help info
      if (await isSubscribed(chatId)) {
        await sendTelegramMessage(chatId, `❓ Неизвестная команда. Введите /help для просмотра списка команд.`);
      } else {
        await sendTelegramMessage(chatId, `🔒 Вы не авторизованы. Отправьте \`/auth <пароль>\` для авторизации.`);
      }
  }
}
