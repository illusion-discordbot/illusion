const Discord = require('discord.js')
const moment = require('moment')
require('moment-duration-format')
module.exports = {
	name: 'uptime',
	description: 'Shows uptime of bot!',
	category: 'utility',
	cooldown: 5,
	execute(client, message, args) {
		const uptime = moment
			.duration(client.uptime)
			.format('D [days], H [hrs], m [mins], s [secs]')
		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle(
					`:chart_with_upwards_trend:  |  I've been running for **${uptime}**!`
				)
				.setColor(process.env.EMBED_COLOR)
				.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
		)
	},
}
