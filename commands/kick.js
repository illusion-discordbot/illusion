require('dotenv')
const Discord = require('discord.js');
module.exports = {
	name: 'kick',
	description: 'kek user',
    cooldown: 5,
    args: true,
    permissions: 'KICK_MEMBERS',
    guildOnly: true,
    usage: '[user] (reason)',
	execute(client, message, args) {
            if(!message.mentions.members.first()) {
                //message.channel.send('you needa give me some1 to kick lol xD kid get rekt');
                //return; 
                return message.reply(new Discord.MessageEmbed()
                    .setTitle(`You need to mention someone!`)
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
            }; 

                if(!message.mentions.members.first().kickable) {
                    //message.channel.send('so i tried to kick them lol and it just didnt work, I dont have perms not gib perms');
                    //return
                    return message.reply(new Discord.MessageEmbed()
                    .setTitle(`I can\'t kick this member!`)
                    .setDescription(`Make Sure I have permissions to kick this member.`)
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
                };

                let kickReason = args.slice(1).join(' ')
                if (!kickReason) {
                    kickReason = "None"
                }


                message.mentions.members.first().send(new Discord.MessageEmbed()
                .setTitle(`You have been kicked from ${message.guild.name}!`)
                .setDescription(`**Moderator:** ${message.author.username}\n**Reason:** ${kickReason} `)
                .setColor(process.env.EMBED_COLOR)
                .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                )
                
                .catch(err => message.channel.send(`I was unable to message this member!`));

                setTimeout(() => {

                    // message.mentions.members.first().kick({reason: kickReason})
                    
                    message.mentions.members.first().kick()
                    .then(message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`I have succesfully kicked ${message.mentions.members.first().user.username}#${message.mentions.members.first().user.discriminator}`)
                    .setDescription(`**Reason: ** ${kickReason}`)
                    .setColor(process.env.EMBED_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    ))
                .catch(console.error);
            }, 750); 

            
        }
    }

    