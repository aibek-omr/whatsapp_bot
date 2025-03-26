const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
    authStrategy: new LocalAuth(), // Сохраняет сессию
});

client.on("qr", (qr) => {
    console.log("🔷 Отсканируйте QR-код для авторизации:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("✅ Бот запущен и авторизован!");
});

// Обработка входящих сообщений
client.on("message", async (message) => {
    let text = message.body.toLowerCase(); // Приводим текст к нижнему регистру

    if (text === "привет") {
        await message.reply("Привет! Я бот стоматологии 🦷\n\nНапишите *'записаться'* для записи на приём.");
    } 
    
    else if (text === "записаться") {
        await message.reply("📅 Напишите дату и время, когда хотите записаться.\nПример: *10 апреля 15:00*.");
    } 
    
    else if (text.match(/\d{1,2} (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря) \d{2}:\d{2}/)) {
        await message.reply("✅ Вы записаны! Ждём вас в нашей клинике.\nЕсли хотите изменить время, напишите *'записаться'*.");
    } 
    
    else if (text === "прайс") {
        await message.reply("💰 *Наш прайс:*\n- Чистка зубов – 3000₽\n- Лечение кариеса – 5000₽\n- Имплантация – 30 000₽");
    } 
    
    else if (text === "адрес") {
        await message.reply("📍 *Адрес нашей клиники:*\nМосква, ул. Ленина, 10.\n🌍 [Перейти в Google Maps](https://goo.gl/maps/example)");
    } 
    
    else {
        await message.reply("❓ Извините, я вас не понял. Попробуйте написать *'прайс'*, *'записаться'* или *'адрес'*.");
    }
});

client.initialize();
