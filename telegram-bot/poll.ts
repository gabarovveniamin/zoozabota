import { processUpdate } from './bot.js';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN is not defined in environment variables.');
  process.exit(1);
}

console.log('🤖 Telegram Bot polling started...');
console.log('Press Ctrl+C to stop.');

let offset = 0;

async function poll() {
  while (true) {
    try {
      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=30`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`getUpdates HTTP error: ${response.status} ${response.statusText}`);
        // Wait 5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
        continue;
      }

      const data: any = await response.json();
      if (!data.ok) {
        console.error('getUpdates API error:', data.description);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        continue;
      }

      const updates = data.result || [];
      for (const update of updates) {
        console.log(`[Bot] Received update ID: ${update.update_id}`);
        await processUpdate(update);
        offset = update.update_id + 1;
      }
    } catch (error) {
      console.error('Error during polling loop:', error);
      // Wait 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

poll();
