const { Client, LocalAuth, Buttons, List } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('message', async msg => {
    const chatId = msg.from;
    const text = msg.body.toLowerCase();

    if (text === "меню") {
        let button = new Buttons(
            "Выберите действие:",
            [
                { body: "Записаться на приём" },
                { body: "Узнать цены" },
                { body: "Адрес клиники" }
            ],
            "Стоматология Бот",
            "Выберите опцию ниже:"
        );
        client.sendMessage(chatId, button);
    } 
    else if (text === "услуги") {
        let list = new List(
            "Выберите услугу:",
            "Показать список",
            [
                {
                    title: "Стоматологические услуги",
                    rows: [
                        { id: "1", title: "Консультация", description: "1000₽" },
                        { id: "2", title: "Пломбирование", description: "3000₽" },
                        { id: "3", title: "Удаление зуба", description: "5000₽" }
                    ]
                }
            ],
            "Выберите услугу из списка:"
        );
        client.sendMessage(chatId, list);
    } 
    else if (text === "записаться на приём") {
        client.sendMessage(chatId, "Ок, я вас записал! 😊");
    } 
    else if (text === "узнать цены") {
        client.sendMessage(chatId, "Тестовые цены:\n- Консультация: 1000₽\n- Пломбирование: 3000₽\n- Удаление зуба: 5000₽");
    } 
    else if (text === "адрес клиники") {
        client.sendMessage(chatId, "Наш адрес: г. Тестовый, ул. Примерная, 10.");
    } 
    else {
        client.sendMessage(chatId, "Я могу помочь с записью, ценами и адресом. Напишите 'Меню' для выбора.");
    }
});

client.initialize();
