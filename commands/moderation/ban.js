const Discord = require('discord.js');
module.exports = {
	name: 'ban',
	description: 'Ban users',
    category: 'moderation',
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
            }

                if(!message.mentions.members.first().bannable) {
                    return message.reply(new Discord.MessageEmbed()
                    .setTitle(`I can't ban this member!`)
                    .setDescription(`Make Sure I have permissions to ban this member.`)
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
                }

                let banReason = args.slice(1).join(' ')
                if (!banReason) {
                    banReason = "None"
                }


                message.mentions.members.first().send(new Discord.MessageEmbed()
                .setTitle(`You have been banned from ${message.guild.name}!`)
                .setDescription(`**Moderator:** ${message.author.tag}\n**Reason:** ${banReason} `)
                .setColor(process.env.EMBED_COLOR)
                .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                )
                .catch(_err => message.channel.send(`I was unable to message this member!`));

                setTimeout(() => {
                    message.mentions.members.first().ban({reason: `Reason: ${banReason}, Mod: ${message.author.tag}` })
                    .then(message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`I have successfully banned ${message.mentions.members.first().user.tag}`)
                    .setDescription(`**Reason:** ${banReason}`)
                    .setColor(process.env.EMBED_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    ))
                .catch(err => client.logger.error(err));
            }, 750); 

            
        }
    }

    