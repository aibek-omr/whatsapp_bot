require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log('QR-код для авторизации:', qr);
});

client.on('ready', () => {
    console.log('✅ Бот запущен и авторизован!');
});

client.on('message', async msg => {
    const chatId = msg.from;
    const text = msg.body.trim();

    // Возможные команды
    if (text === "1") {
        client.sendMessage(chatId, "Ок, я вас записал на приём! 😊");
    } else if (text === "2") {
        client.sendMessage(chatId, "Наши цены:\n- Консультация: 1000₽\n- Пломбирование: 3000₽\n- Удаление зуба: 5000₽");
    } else if (text === "3") {
        client.sendMessage(chatId, "Наш адрес: г. Тестовый, ул. Примерная, 10.");
    } else if (text === "4") {
        client.sendMessage(chatId, "Вы можете позвонить нам: +7 999 123-45-67.");
    } else {
        client.sendMessage(chatId,
            "🤖 Выберите, что вам нужно:\n" +
            "1️⃣ Записаться на приём\n" +
            "2️⃣ Узнать цены\n" +
            "3️⃣ Адрес клиники\n" +
            "4️⃣ Телефон клиники"
        );
    }
});

client.initialize();
