const Discord = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = async (client, message) => {
    const settings = await Guild.findOne({
        guildID: message.guild.id
    }, (err, guild) => {
        if (err) console.error(err)
    });
    if (!settings.logChannelID) {return true}
    message.guild.channels.cache.get(settings.logChannelID).send(new Discord.MessageEmbed()
    .setTitle(`Message Deleted`)
    .setDescription(`**Channel:** ${message.channel}\n**Author:** ${message.author}\n**Content:** ${message.content}`)
    .setColor(process.env.EMBED_COLOR)
    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
    )

    if (message.mentions.members.size > 0 ) {
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Ghost Ping Detected!`)
        .setDescription(`**Channel:** ${message.channel}\n**Author:** ${message.author}\n**Content:** ${message.content}`)
        .setColor(process.env.EMBED_COLOR)
        .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
        )
      }
};