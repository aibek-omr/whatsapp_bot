require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
    console.error("Ошибка: API-ключ OpenAI не найден. Проверьте файл .env.");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('message', async msg => {
    const chatId = msg.from;
    const text = msg.body.toLowerCase();

    // Обработка ключевых слов по стоматологии
    if (text.includes("записаться") || text.includes("прием") || text.includes("стоматолог")) {
        client.sendMessage(chatId, "Ок, я вас записал! 😊");
    } else if (text.includes("адрес")) {
        client.sendMessage(chatId, "Наш адрес: г. Тестовый, ул. Примерная, 10.");
    } else if (text.includes("номер")) {
        client.sendMessage(chatId, "Вы можете позвонить нам: +7 999 123-45-67.");
    } else if (text.includes("цены") || text.includes("прайс")) {
        client.sendMessage(chatId, "Тестовые цены:\n- Консультация: 1000₽\n- Пломбирование: 3000₽\n- Удаление зуба: 5000₽");
    } else {
        // Ограничиваем ответы только стоматологическими темами
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Ты - бот стоматологической клиники. Отвечай только на вопросы по стоматологии." },
                    { role: "user", content: text }
                ],
            });

            const reply = response.choices[0].message.content;
            client.sendMessage(chatId, reply);
        } catch (error) {
            console.error("Ошибка запроса к OpenAI:", error);
            client.sendMessage(chatId, "Извините, произошла ошибка. Попробуйте позже.");
        }
    }
});

client.initialize();

