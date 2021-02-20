const Discord = require('discord.js');
module.exports = {
	name: 'kick',
	description: 'kek user',
    category: 'moderation',
    cooldown: 5,
    args: true,
    permissions: 'KICK_MEMBERS',
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

                if(!message.mentions.members.first().kickable) {
                    return message.reply(new Discord.MessageEmbed()
                    .setTitle(`I can't kick this member!`)
                    .setDescription(`Make Sure I have permissions to kick this member.`)
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
                }

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
                .catch(_err => message.channel.send(`I was unable to message this member!`));

                setTimeout(() => {
                    message.mentions.members.first().kick(`Reason: ${kickReason}, Mod: ${message.author.tag}`)
                    .then(message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`I have succesfully kicked ${message.mentions.members.first().user.username}#${message.mentions.members.first().user.discriminator}`)
                    .setDescription(`**Reason:** ${kickReason}`)
                    .setColor(process.env.EMBED_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    ))
                .catch(err => client.logger.error(err));
            }, 750); 

            
        }
    }

    