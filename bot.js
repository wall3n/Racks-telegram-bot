const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.DB_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const inviteLink = process.env.DB_LINK;
const chatAdsId = process.env.DB_CHAT_ADS_ID;

//Apartado Privado

//Boton de start para nuevos usuarios
bot.onText(/^\/start/, (msg) => {
    let chatId = msg.chat.id;
    let chatType = msg.chat.type;

    if(chatType === 'private'){
        let nameUser = msg.from.first_name;
        let button = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'ENTRAR AL GRUPO', callback_data: 'boton1' }]
                ]
            }
        }
        bot.sendMessage(chatId, `Hola ${nameUser} bienvenido al hall de Racks, para continuar y entrar al grupo pulse el boton y se le enviara el enlace`, button)
    }
})

//Funcion para hacer interactivo el boton
bot.on('callback_query', function onCallbackQuery(accionboton){
    const data = accionboton.data
    const msg = accionboton.message
    let chatId = msg.chat.id

    if(data === 'boton1'){
        bot.sendMessage(chatId, `El enlace de invitacion al grupo es: ${inviteLink}`)
    }
})

//Funcion para enviar un mensaje si se detecta que un bot entra en el grupo
bot.on('message', (msg) => {
    let chatId = msg.chat.id;
    let chatType = msg.chat.type;
    if(msg.new_chat_members != undefined && chatType === 'supergroup' && msg.new_chat_member.is_bot){
        let newUserName = msg.new_chat_members.first_name
        msg.sendMessage(chatId, `Buenas ${newUserName} ha entrado al grupo y ha sido detectado como un bot`) 
    }
})

//Apartado publico

//Comando Ping (Para comprobar si el bot esta activo)
bot.onText(/^\/ping/, (msg) => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, "Pong!")
    console.log(msg.chat.id)
})

//Comando de ayuda
bot.onText(/^\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, '<b>Apartado de ayuda</b>', { parse_mode: "HTML"})
})

//Comando para enviar las alertas de streams y videos
bot.on('message', (msg) => {
    let msgAuthor = msg.from.first_name
    let chatId = msg.chat.id
    if(msgAuthor === 'IFTTT' && chatAdsId === chatId){
        bot.copyMessage(chatId, msg.message_id)
        bot.forwardMessage(chatAdsId, msg.message_id)
    }
})
