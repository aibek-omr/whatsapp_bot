const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('message', async msg => {
    const chatId = msg.from;
    const text = msg.body.toLowerCase();

    if (text.includes("записаться") || text.includes("прием") || text.includes("стоматолог")) {
        client.sendMessage(chatId, "Ок, я вас записал! 😊");
    } else if (text.includes("адрес")) {
        client.sendMessage(chatId, "Наш адрес: г. Тестовый, ул. Примерная, 10.");
    } else if (text.includes("номер")) {
        client.sendMessage(chatId, "Вы можете позвонить нам: +7 999 123-45-67.");
    } else if (text.includes("цены") || text.includes("прайс")) {
        client.sendMessage(chatId, "Тестовые цены:\n- Консультация: 1000₽\n- Пломбирование: 3000₽\n- Удаление зуба: 5000₽");
    } else {
        // Запрос к локальной модели через Ollama API
        try {
            const response = await axios.post('http://localhost:11434/api/generate', {
                model: "mistral",
                prompt: text
            });

            const reply = response.data.response;
            client.sendMessage(chatId, reply);
        } catch (error) {
            console.error("Ошибка запроса к локальной модели:", error);
            client.sendMessage(chatId, "Извините, произошла ошибка. Попробуйте позже.");
        }
    }
});

client.initialize();
