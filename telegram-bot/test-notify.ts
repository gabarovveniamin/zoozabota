import { sendTelegramNotification } from '../api/_utils/telegram.js';

console.log('🚀 Отправка тестового уведомления для заявки на питомца...');
await sendTelegramNotification('pet', {
  name: 'Барсик (Тест)',
  breed: 'Сиамский',
  years: '2015 - 2026',
  emoji: '🐱',
  email: 'test@example.com',
  description: 'Это тестовое уведомление для проверки работы Telegram-бота.',
  photo: null
});

console.log('🚀 Отправка тестового уведомления для заказа памятника...');
await sendTelegramNotification('service', {
  service_title: 'Гранитный стандарт (Тест)',
  name: 'Иван Тестовый',
  phone: '+7 (777) 777-77-77',
  email: 'ivan@example.com',
  comment: 'Тестовый комментарий к заказу памятника.'
});

console.log('✅ Тестовые уведомления отправлены!');
