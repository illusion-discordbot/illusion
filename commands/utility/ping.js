const Discord = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Ping!',
    category: 'utility',
	cooldown: 5,
	execute(client, message, args) {
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
        .setColor(process.env.EMBED_COLOR)
        .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
        )
	},
};
