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
    .then(
        starting_proc => {
            TOKEN = starting_proc;
            const bot = new TgB(TOKEN, {
                polling: true
            });

            const helper = require('./helper');
            const ans_notes = require('./array-notes');
            const dir = "./pic/";


            let right_ans = -1;
            let pic_num = -1;
            let users = [];

    //start bot
            bot.onText(/\/start/, (msg) => {
                const {id} = msg.chat;
                if(!helper.exist(users,id)) {

                    console.log(`User ${msg.chat.username} has started the bot`)

                    users.push({
                        id: id,
                        name: msg.chat.username,
                        right_ans: {}
                    });
                    started = true;
                    bot.sendMessage(id, "Привет пользователь. Тебе предстоит узнавать ноты в скрипичном ключе. Я тебе буду отправлять" +
                        "картинки, а ты пиши название ноты: до, ре, ми, фа, соль, ля, си")
                    users[users.length].right_ans = ans_notes[helper.Rand(pic_num)];
                    console.log("right ans is " + users[users.length].right_ans.ans)
                    bot.sendPhoto(id, dir + users[users.length].right_ans.pic);
                }
                else{
                    bot.sendMessage(id, "Вы уже запустили меня");
                }
            })

    //stop bot
            bot.onText(/\/end/, (msg) => {
                const {id} = msg.chat;
                if(helper.exist(users,id)) {
                    let user_id = helper.check(users,id);
                    users.splice(user_id,1)
                    bot.sendMessage(id, "Заканчиваем тренировку...")
                    console.log(`User ${msg.chat.username} end using bot`)
                }
            })


    //react on message
            bot.on('message', (msg) => {
                const {id} = msg.chat;
                if(helper.exist(users, id) && msg.text != "/end") {
                    let user_id = helper.check(users,id);
                    let answer = msg.text.toLowerCase();

                    if(answer === users[user_id].right_ans.ans){
                        bot.sendMessage(id, 'Правильно! ✅');
                    }
                    else{
                        bot.sendMessage(id, `Не правильно! ❌\nЭто *${ans_notes[right_ans].ans}*`, {
                            parse_mode: 'Markdown'
                        });
                    }

                    setTimeout(() => {
                        users[user_id].right_ans = ans_notes[helper.Rand(pic_num)];
                        console.log("right ans is " + users[user_id].right_ans.ans)
                        bot.sendPhoto(id, dir + users[user_id].right_ans.pic);
                        console.log("right ans is " + notes[right_ans])
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




