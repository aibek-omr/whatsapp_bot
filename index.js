require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}));

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('message', async msg => {
    const chatId = msg.from;
    const text = msg.body.toLowerCase();

    // Проверяем, связано ли сообщение со стоматологией
    if (text.includes("записаться") || text.includes("прием") || text.includes("стоматолог")) {
        client.sendMessage(chatId, "Ок, я вас записал! 😊");
    } else if (text.includes("адрес")) {
        client.sendMessage(chatId, "Наш адрес: г. Тестовый, ул. Примерная, 10.");
    } else if (text.includes("номер")) {
        client.sendMessage(chatId, "Вы можете позвонить нам: +7 999 123-45-67.");
    } else if (text.includes("цены") || text.includes("прайс")) {
        client.sendMessage(chatId, "Тестовые цены:\n- Консультация: 1000₽\n- Пломбирование: 3000₽\n- Удаление зуба: 5000₽");
    } else {
        // Отправляем запрос в ChatGPT
        try {
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: text }],
            });

            const reply = response.data.choices[0].message.content;
            client.sendMessage(chatId, reply);
        } catch (error) {
            console.error(error);
            client.sendMessage(chatId, "Извините, произошла ошибка. Попробуйте позже.");
        }
    }
});

client.initialize();

