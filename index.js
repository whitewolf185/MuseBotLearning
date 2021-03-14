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
            const commands = ["/start", "/end"];
	    console.log("BOT STARTED.....");

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
                   
                    bot.sendMessage(id, "Привет пользователь. Тебе предстоит узнавать ноты в скрипичном ключе. Я тебе буду отправлять" +
                        "картинки, а ты пиши название ноты: до, ре, ми, фа, соль, ля, си")
	                pic_num = helper.Rand(pic_num);
                    users[users.length - 1].right_ans = ans_notes[pic_num];
                    // console.log("right ans is " + users[users.length - 1].right_ans.ans)
                    bot.sendPhoto(id, dir + users[users.length - 1].right_ans.pic);
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
                if(helper.exist(users, id) && commands.indexOf(msg.text) == -1) {
                    // console.log("Im here")
                    let user_id = helper.check(users,id);
                    let answer = msg.text.toLowerCase();
                    // console.log(users[user_id])

                    if(answer == users[user_id].right_ans.ans){
                        bot.sendMessage(id, 'Правильно! ✅');
                    }
                    else{
                        bot.sendMessage(id, `Не правильно! ❌\nЭто *${users[user_id].right_ans.ans}*`, {
                            parse_mode: 'Markdown'
                        });
                    }

                    setTimeout(() => {
                        pic_num = helper.Rand(pic_num);
                        users[user_id].right_ans = ans_notes[pic_num];
                        // console.log("right ans is " + users[user_id].right_ans.ans)
                        bot.sendPhoto(id, dir + users[user_id].right_ans.pic);
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




