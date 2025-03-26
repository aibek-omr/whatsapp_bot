require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const { OpenAIApi, Configuration } = require('openai');

const openai = new OpenAIApi(
    new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

const client = new Client({ authStrategy: new LocalAuth() });

client.on('message', async (msg) => {
    const chatId = msg.from;
    const text = msg.body.toLowerCase();

    // Обрабатываем ключевые вопросы без ИИ
    if (text.includes('записаться') || text.includes('прием')) {
        client.sendMessage(chatId, 'Ок, я вас записал! 😊');
        return;
    }
    if (text.includes('адрес')) {
        client.sendMessage(chatId, 'Наш адрес: г. Тестовый, ул. Примерная, 10.');
        return;
    }
    if (text.includes('номер')) {
        client.sendMessage(chatId, 'Вы можете позвонить нам: +7 999 123-45-67.');
        return;
    }
    if (text.includes('цены') || text.includes('прайс')) {
        client.sendMessage(
            chatId,
            'Тестовые цены:\n- Консультация: 1000₽\n- Пломбирование: 3000₽\n- Удаление зуба: 5000₽'
        );
        return;
    }

    // Если сообщение не по стоматологии, перенаправляем в тему
    const prompt = `Ты бот-консультант стоматологической клиники. Отвечай на вопросы пользователей по теме стоматологии. Если вопрос не связан со стоматологией, постарайся направить разговор в эту сторону.
    
    Пользователь: ${text}
    Бот:`;

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: prompt }],
        });

        const reply = response.data.choices[0].message.content;
        client.sendMessage(chatId, reply);
    } catch (error) {
        console.error('Ошибка OpenAI:', error);
        client.sendMessage(chatId, 'Извините, произошла ошибка. Попробуйте позже.');
    }
});

client.initialize();
