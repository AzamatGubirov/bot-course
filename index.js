const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '5754934673:AAGPE065d9qafghYX6C3BL_fpQC4vCa0njo';

const bot = new TelegramApi(token, { polling: true });

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай!', gameOptions);
}
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Получить информацию о пользователе' },
        { command: '/game', description: 'Угадай игру' },
    ]);

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, 'Добро пожаловать в Магазин');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');
    });
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId)
        }
        if (data === chats[chatId]){
            return bot.sendMessage(chatId,`Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)}
        else{
            return bot.sendMessage(chatId,`К сожалению ты не отгадал цифру ${chats[chatId]}`, againOptions);}


    })
};

start()