require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios'); // Используем axios для запросов к Together AI

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

if (!TOGETHER_API_KEY) {
    console.error("Ошибка: API-ключ Together AI не найден. Проверьте файл .env.");
    process.exit(1);
}

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
        // Запрос к Together AI
        try {
            const response = await axios.post(
                "https://api.together.xyz/v1/chat/completions",
                {
                    model: "mistral-7b-instruct", // Можно изменить на другой, если нужно
                    messages: [
                        { role: "system", content: "Ты - бот стоматологической клиники. Отвечай только на вопросы по стоматологии." },
                        { role: "user", content: text }
                    ],
                    temperature: 0.7,
                    max_tokens: 200
                },
                {
                    headers: {
                        "Authorization": `Bearer ${TOGETHER_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const reply = response.data.choices[0].message.content;
            client.sendMessage(chatId, reply);
        } catch (error) {
            console.error("Ошибка запроса к Together AI:", error.response ? error.response.data : error.message);
            client.sendMessage(chatId, "Извините, произошла ошибка. Попробуйте позже.");
        }
    }
});

client.initialize();
