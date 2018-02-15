const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");

client.on('ready', () => {
    console.log('I am ready!');
});

client.on("stats", () => {
  client.user.setGame(`Test`);
    
});

client.on("message", async message => {

  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
    
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  
  }
    
  if(command === "kick") {
    if(!message.member.roles.some(r=>["C-Admin", "moderators","Admins"].includes(r.name)) )
      return message.reply("אין לך תגישה הזו");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("בבקשה תרשום שם של מי שאמור לקבל את זה");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    
    await member.kick(reason)
      .catch(error => message.reply(`מצטער אך השחקן${message.author} לא יכול לקבל קיק : ${error}`));
    message.reply(`${member.user.tag} קיבל קיק ${message.author.tag} בגלל: ${reason}`);

  }
    if(command === "ban") {
    if(!message.member.roles.some(r=>["C-Admin", "moderators","Admins"].includes(r.name)) )
      return message.reply("אין לך תגישה הזו");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("בבקשה תרשום שם של מי שאמור לקבל את זה");
    if(!member.bannable) 
      return message.reply("?אני לא יכול לתת לו באן למי שיש רול גבוהה יותר מימני יש לי גישה בכלל לבאן");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("בבקשה תן סיבה לבאן");
    
    await member.ban(reason)
      .catch(error => message.reply(`מצטער אך אני לא יכול לתת באן ל${message.author}בגלל  : ${error}`));
    message.reply(`${member.user.tag} קיבל באן ${message.author.tag} בגלל: ${reason}`);
  }
    if(command === "cm") {
    
    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 1000)
      return message.reply("בבקשה תרשום עד כמה למחוק מ2 עד 1000");
    
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`לא יכול למחוק תהודעה בגלל: ${error}`));
  }
});

client.on('message', msg => {
  if (msg.content === '?helpme') {
    msg.reply('@C-Admin , @Admins , @moderators , @Guardians , צריכים פה עזרה תעזו לנקניק');
  }
});



client.login(config.token);
