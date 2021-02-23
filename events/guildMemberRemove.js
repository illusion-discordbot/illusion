const Discord = require('discord.js');
const Guild = require('../models/guild');

module.exports = async (client, member) => {
    const settings = await Guild.findOne({
        guildID: member.guild.id
    }, (err, guild) => {
        if (err) client.logger.error(err)
    });
    if (!settings.welcomeChannelID) {return true}
    member.guild.channels.cache.get(settings.welcomeChannelID).send(new Discord.MessageEmbed()
        .setTitle(`Goodbye ${member.user.tag}!`)
        .setDescription(`${member.user.tag} has left ${member.guild.name}!\n**Current Members:** ${member.guild.memberCount}`)
        .setTimestamp()
        .setColor(process.env.EMBED_COLOR)
        .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
        )
};