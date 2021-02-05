require('dotenv')
const Discord = require('discord.js');
module.exports = {
	name: 'bans',
	description: 'ban user',
    cooldown: 5,
    args: true,
    permissions: 'BAN_MEMBERS',
    guildOnly: true,
    usage: '[user] (reason)',
	execute(client, message, args) {
            if(!message.mentions.members.first()) {
                return message.reply(new Discord.MessageEmbed()
                    .setTitle(`You need to mention someone!`)
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
            }; 

                if(!message.mentions.members.first().banable) {
                    return message.reply(new Discord.MessageEmbed()
                    .setTitle(`I can\'t ban this member!`)
                    .setDescription(`Make Sure I have permissions to ban this member.`)
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
                };

                let banreason = args.slice(0).join(' ')
                if (!banreason) {
                    banreason = "None"
                }

                message.mentions.members.first().send(new Discord.MessageEmbed()
                .setTitle(`You have been banned from ${message.guild.name}!`)
                .setDescription(`**Moderator:** ${message.author.username}\n**Reason:** Coming Soon `)
                .setColor(process.env.EMBED_COLOR)
                .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                )
                
                .catch(err => message.channel.send(`I was unable to message this member!`));

                setTimeout(() => {

                    message.mentions.members.first().ban({reason: banreason})
                    .then(message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`I have succesfully banned ${message.mentions.members.first().user.username}#${message.mentions.members.first().user.discriminator}`)
                    .setColor(process.env.EMBED_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    ))
                .catch(console.error);
            }, 750); 

            
        }
    }

    