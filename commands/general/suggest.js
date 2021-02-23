const Discord = require('discord.js');
const Guild = require('../../models/guild');
module.exports = {
    name: 'suggest',
	description: 'Send Suggestions to your server\'s suggestion channel!',
    category: 'general',
    cooldown: 5,
    guildOnly: true,
    args: true,
    usage: '[Suggestion]',
        async execute(client, message, args){
        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) client.logger.error(err)
        });
        if (!settings.suggestionChannelID) {
            return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Error`)
            .setDescription(`You need to set a Suggestion Channel first!`)
            .setColor(process.env.EMBED_ERROR_COLOR)
            .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
            
       )
        }
        const msg = await message.guild.channels.cache.get(settings.suggestionChannelID).send(new Discord.MessageEmbed()
             .setAuthor(`New Suggestion from ${message.author.tag}!`, message.author.avatarURL())
             .setDescription(args.join(" "))
             .setTimestamp()
             .setColor(process.env.EMBED_COLOR)
             .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
             
        )
        msg.react('✅')
        msg.react('❌')
        message.delete()
	},
};