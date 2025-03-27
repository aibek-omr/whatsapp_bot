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

    // Приветствие от лица клиники
    if (text.toLowerCase() === "привет" || text.toLowerCase() === "здравствуйте") {
        client.sendMessage(chatId, 
            "Здравствуйте! Вы обратились в стоматологическую клинику. Чем можем помочь?\n" +
            "1️⃣ Записаться на приём\n" +
            "2️⃣ Узнать цены\n" +
            "3️⃣ Адрес клиники\n" +
            "4️⃣ Телефон клиники"
        );
        return;
    }

    // Ответы на запросы
    if (text === "1") {
        client.sendMessage(chatId, "Мы записали вас на приём. Уточните удобное время.");
    } else if (text === "2") {
        client.sendMessage(chatId, "Цены на услуги:\n- Консультация: 1000₽\n- Пломбирование: 3000₽\n- Удаление зуба: 5000₽.");
    } else if (text === "3") {
        client.sendMessage(chatId, "Адрес клиники: г. Тестовый, ул. Примерная, 10.");
    } else if (text === "4") {
        client.sendMessage(chatId, "Телефон для связи: +7 999 123-45-67.");
    } else {
        client.sendMessage(chatId,
            "Не совсем поняли ваш запрос. Уточните, пожалуйста, или выберите вариант:\n" +
            "1️⃣ Записаться на приём\n" +
            "2️⃣ Узнать цены\n" +
            "3️⃣ Адрес клиники\n" +
            "4️⃣ Телефон клиники"
        );
    }
});

client.initialize();
