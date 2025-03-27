const { Client, LocalAuth, Buttons } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('message', async msg => {
    if (msg.body.toLowerCase() === "меню") {
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

        client.sendMessage(msg.from, button);
    }
});

client.initialize();
