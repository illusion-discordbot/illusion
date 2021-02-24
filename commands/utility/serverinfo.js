const Discord = require('discord.js')
module.exports = {
	name: 'serverinfo',
	description: 'Displays server information',
	category: 'utility',
	cooldown: 5,
	execute(client, message, args) {
		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle('Server Info')
				.setThumbnail(message.guild.iconURL)
				.addField('Owner', `The owner of this server is ${message.guild.owner}`)
				.addField(
					'Member Count',
					`This server has ${message.guild.memberCount} members`
				)
				.addField(
					'Emoji Count',
					`This server has ${message.guild.emojis.cache.size} emojis`
				)
				.addField(
					'Roles Count',
					`This server has ${message.guild.roles.cache.size} roles`
				)

				.setColor(process.env.EMBED_COLOR)
				.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
		)
	},
}
