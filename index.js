const TgB = require('node-telegram-bot-api');
const fs = require('fs');
let TOKEN = ''

let start = new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/token.txt', 'utf8', (err, data) => {
        if (err) {
            reject(err);
        }
        resolve(data);
    })
})

start
    .then(starting_proc => {
        TOKEN = starting_proc;

        const bot = new TgB(TOKEN, {
            polling: true
        })
        const helper = require('./helper')

        let right_ans = -1;
        let started = false;
        let pic_num = -1

        const notes = ['до', 'ре', 'ми', 'фа', 'соль', 'ля', 'си'];
        const pics = ["до.png", "ре.png", "ми.png", "фа.png", "соль.png", "ля.png", "си.png", "до1.png", "ре1.png", "ми1.png", "фа1.png", "соль1.png", "ля1.png", "си1.png", "ля_.png", "си_.png"];
        const dir = "./pic/";

        function find(index){
            let result = -1;
            notes.forEach((item, i, arr) => {
                if(pics[index].indexOf(item) != -1){
                    result = i;
                }
            })

            return result
        }

//start bot
        bot.onText(/\/start/, (msg) =>{
            console.log("New user has started the bot")
            const {id} = msg.chat;
            started = true;
            bot.sendMessage(id, "Привет пользователь. Тебе предстоит узнавать ноты в скрипичном ключе. Я тебе буду отправлять" +
                "картинки, а ты пиши название ноты: до, ре, ми, фа, соль, ля, си")
            pic_num = helper.Rand(pic_num);
            right_ans = find(pic_num);
            bot.sendPhoto(id, dir + pics[pic_num]);
        })

//stop bot
        bot.onText(/\/end/, (msg) => {
            if(started) {
                const {id} = msg.chat;
                bot.sendMessage(id, "Заканчиваем тренировку...")
                right_ans = -1;
                started = false;
                pic_num = -1
                console.log("Пользователь ")
            }
        })


//react on message

        bot.on('message', (msg) => {
            if(started && msg.text != "/end") {
                const {id} = msg.chat;
                let answer = msg.text.toLowerCase()
                // console.log(answer);

                let num_ans = helper.check(notes, answer)
                // console.log(right_ans + " " + num_ans + "\n")
                if(num_ans !== -1 && num_ans == right_ans){
                    bot.sendMessage(id, 'Правильно! ✅');
                }
                else{
                    bot.sendMessage(id, `Не правильно! ❌\nЭто *${notes[right_ans]}*`, {
                        parse_mode: 'Markdown'
                    });
                }

                setTimeout(() => {
                    pic_num = helper.Rand(pic_num);
                    right_ans = find(pic_num);
                    bot.sendPhoto(id, dir + pics[pic_num]);
                }, 300)
            }
        })



            //cannot find token
    },
    error => {
        console.log("Cannot find token. Please check your path to token.\n" +
            "Now your dirname is " + __dirname + "\n\n");
        throw error;
    }
    )




