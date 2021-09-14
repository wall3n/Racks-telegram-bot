const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.DB_TOKEN;
const bot = new TelegramBot(token, { polling:true });
const normasText = '<b>Artículo 1: Perfiles y avatares</b>\n1. Los nombres y avatares deben ser adecuados y aptos para menores de edad.\n2. Recomendamos evitar el uso de caracteres especiales en los nombres, para facilitar el trabajo del Staff, y para que los demás usuarios te puedan mencionar más fácilmente.\n3. Suplantar la identidad de una persona o bot está prohibido\n\n<b>Artículo 2: La lengua española en el servidor</b>\n1. Este servidor es de habla hispana, por lo tanto, el español es el único idioma permitido en el servidor.\n2. Los mensajes deben ser comprensibles, y en la medida de lo posible, con buena ortografía.\n3. El lenguaje SMS no está prohibido, pero no es recomendable usarlo, para que todos los usuarios puedan entenderte, y evitar malentendidos.\n\n<b>Artículo 3: Insultos, faltas de respeto y lenguaje vulgar</b>\n1. Cualquier mensaje de carácter discriminatorio, violento, o incitando al odio será eliminado, y el autor será sancionado.\n2. Las faltas de respeto, las amenazas y el acoso están prohibidos.\n3. El lenguaje vulgar será censurado y el autor sancionado.\n4. Cualquier intento de evadir los filtros usando caracteres especiales, cambiando letras o escribiendo espacios entre letras, será penalizado.\n\n<b>Artículo 4: Contenido sexual y NSFW</b>\nNo se puede publicar nada, transmitir o compartir que sea NSFW, sexualmente explícito, perturbador o que muestre una naturaleza grave.\n\n<b>Artículo 5: Los canales de texto</b>\n1. Este servidor está dotado de varios canales de texto, así que antes de enviar un mensaje asegúrate de que está en el canal correcto\n\n<b>Artículo 6: Los canales de voz</b>\n1. Está prohibido usar tu voz para molestar a otros usuarios.\n2. Los bots de música solo se pueden usar en los canales creados exclusivamente para ellos.\n\n<b>Artículo 7: Privacidad</b>\n1. Está prohibido compartir información personal de otra persona tal como lugar de residencia, nombre real, edad, contraseñas, etc.\n2. Solo se puede compartir información personal de otra persona con su consentimiento previo y si ésta no puede afectar a la seguridad del individuo en cuestión.\n\n<b>Artículo 8: Moderación</b>\n1. Está prohibido hacer el trabajo del equipo de moderación, como por ejemplo redirigir a los usuarios a otro canal, amenazarlos con sancionarlos, etc. Esto no significa que no puedas ayudar a otros usuarios, pero las tareas de moderación son exclusivas para los moderadores.\n2. Está prohibido interferir en las tareas de moderación, como por ejemplo enviar reportes falsos, llamando al Staff sin un buen motivo, etc.\n\n<b>Artículo 9: Medida excepcional</b>\nEl Staff se reserva el derecho de sancionar a cualquier usuario cuyo comportamiento es perjudicial para el servidor y la comunidad. Asimismo, cualquier discusión o contenido puede estar sujeto a sanciones si se determina que es perjudicial para la comunidad.'
const modToken = process.env.DB_AUTH

//Depuracion de errores
bot.on("polling_error" , console.log)


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
    let inviteLink = process.env.DB_LINK

    
    if(data === 'normas'){
        bot.sendMessage(chatId, `${normasText}`, { parse_mode: "HTML" }).then(bot.sendMessage(chatId, 'Si acepta las normas y quiere entrar en el grupo por favor pulse el siguiente boton', boton2))
    } else if(data === 'cancelar'){
        bot.sendMessage(chatId, 'Entendido, hasta otra')
    } else if(data === 'aceptar'){
        bot.sendMessage(chatId, `Perfecto, aqui tiene su invitacion al grupo continue: ${inviteLink}`)
    } else if(data === 'stop'){
        bot.sendMessage(chatId, 'Entendido, hasta otra')
    }

})

//Funcion para enviar un mensaje si se detecta que un bot entra en el grupo
bot.on('text', (msg) => {
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
    let msgAuthor = msg.from.id;
    if(msgAuthor === 520419049){
        bot.sendMessage(chatId, "Pong!")
        console.log(msg)
    } else {
        bot.sendMessage(chatId, "Pong!")
    }
})

//Comando de ayuda
bot.onText(/^\/help/, (msg) => {
    let chatId = msg.chat.id
    let chatType = msg.chat.type
    if(chatType === 'private'){
    bot.sendMessage(chatId, 'Por favor introduzca el token de autenticacion:')
    bot.onText(/^\970c897e69bb1002053f337e85e7fcae/, (msg) => {
    bot.sendMessage(chatId, '<b>Apartado de ayuda</b>\n\n<i><b>Comandos:</b></i>\n/ping Permite conocer el estado del bot para cualquier administrador\n/normas Permite enviar las normas al chat del grupo\n\nFuncionalidades:\n-Formulario de entrada: Permite a cualquier usuario que entre al servidor tenga que aceptar las normas y pulsar sobre la pantalla asi evitando la posible entrada de bots camuflados\n-Alerta de Bots: Esta implementada una funcionalidad que se activa de manera automatica para que avise en el grupo la entrada de cualquier cuenta marcada con el identificador de bot', { parse_mode: "HTML"})
    })
    }
})

//Comando para enviar las alertas de streams y videos
bot.on('text', (msg) => {
    let chatId = msg.chat.id
    if(chatId === -1001561696994 && msg.from.username === 'IFTTT'){
        bot.copyMessage(chatId, msg.message_id)
        bot.forwardMessage(chatAdsId, msg.message_id)
    }
})

//Comando para enviar normas
bot.onText(/^\/normas/, (msg) => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, `${normasText}`, { parse_mode: "HTML" })
})

