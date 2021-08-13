const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.DB_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const inviteLink = process.env.DB_LINK;
const chatAdsId = process.env.DB_CHAT_ADS_ID;
const normasText = process.env.DB_RULES
const modToken = process.env.DB_AUTH
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
                    [
                        { text: 'VER NORMAS', callback_data: 'normas' },
                        { text: 'CANCELAR', callback_data: 'cancelar'}

                    ]
                ]
            }
        }

        bot.sendMessage(chatId, `Hola ${nameUser} bienvenido al hall de Racks:\n\nPara continuar y entrar al grupo pulse el boton para ver las normas y posteriormente entrar al servidor`, button)
    }
})

//Funcion para hacer interactivo el boton
bot.on('callback_query', function onCallbackQuery(accionboton){
    const data = accionboton.data
    const msg = accionboton.message
    let chatId = msg.chat.id 
    let boton2 = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'ACEPTAR', callback_data: 'aceptar'},
                    { text: 'STOP', callback_data: 'stop' }
                ]
            ]
        }
    };

    
    if(data === 'normas'){
        bot.sendMessage(chatId, `${normasText}`, { parse_mode: "HTML" }).then(bot.sendMessage(chatId, 'Si acepta las normas y quiere entrar en el grupo por favor pulse el siguiente boton', boton2))
    } else if(data === 'cancelar'){
        bot.sendMessage(chatId, 'Entendido, hasta otra')
    } else if(data === 'aceptar'){
        bot.sendMessage(chatId, `Perfecto, aqui tiene su invitacion al grupo continue: ${inviteLink}`)
    } else if(data === 'stop'){
        bot.sendMessage('Entendido, hasta otra')
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
    let chatId = msg.chat.id
    let chatType = msg.chat.type
    if(chatType === 'private'){
    bot.sendMessage(chatId, 'Por favor introduzca el token de autenticacion:')
    bot.on('message', (msg) => {
        let chatId = msg.chat.id
        let chatContent = msg.text
        if(chatType === 'private' && chatContent === modToken){
            bot.sendMessage(chatId, '<b>Apartado de ayuda</b>\n\n<i><b>Comandos:</b></i>\n/ping Permite conocer el estado del bot para cualquier administrador\n/normas Permite enviar las normas al chat del grupo\n\nFuncionalidades:\n-Formulario de entrada: Permite a cualquier usuario que entre al servidor tenga que aceptar las normas y pulsar sobre la pantalla asi evitando la posible entrada de bots camuflados\n-Alerta de Bots: Esta implementada una funcionalidad que se activa de manera automatica para que avise en el grupo la entrada de cualquier cuenta marcada con el identificador de bot', { parse_mode: "HTML"})
        }
    })
    }
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

//Comando para enviar normas
bot.onText(/^\/normas/, (msg) => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, `${normasText}`, { parse_mode: "HTML" })
})
