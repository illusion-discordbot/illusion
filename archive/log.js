const Discord = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../models/guild');
module.exports = {
	name: 'log',
	description: 'Sets the channel that logs will be sent in!',
    cooldown: 5,
    aliases: ['modlog'],
    usage: '<#channel>',
    args: true,
    guildOnly: true,
    permissions: 'MANAGE_GUILD',
	async execute(client, message, args) {

        const channel = message.mentions.channels.first();

        if(!channel) {
            return message.reply(new Discord.MessageEmbed()
                .setTitle(`You need to mention a channel!`)
                .setColor(process.env.EMBED_ERROR_COLOR)
                .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                )
        }; 

        await Guild.findOne({
            guildID: message.guild.id
        }, async (err, guild) => {
            if (err) client.logger.error(err)
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: '-',
                    logChannelID: channel.id
                });

                await newGuild.save()
               // .then(result => console.log(result))
                .catch(err => client.logger.error(err));

                return message.channel.send(`The logs channel has been set to ${channel}.`);
            } else {
                guild.updateOne({
                    logChannelID: channel.id
                })
                .catch(err => client.logger.error(err));

                return message.channel.send(`The logs channel has been set to ${channel}.`);
            }
        });
	},
};