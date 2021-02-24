const Discord = require('discord.js')
module.exports = {
	name: 'clear',
	description: 'Delete messages',
	category: 'moderation',
	cooldown: 5,
	args: true,
	permissions: 'MANAGE_MESSAGES',
	guildOnly: true,
	aliases: ['purge', 'prune'],
	usage: '[amount]',
	execute(client, message, args) {
		const amount = parseInt(args[0]) + 1

		if (isNaN(amount)) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setTitle('Error!')
					.setDescription('Thats not a valid number.')
					.setColor(process.env.EMBED_ERROR_COLOR)
					.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
			)
		} else if (amount <= 1 || amount > 100) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setTitle('Error!')
					.setDescription('you need to input a number between 1 and 99.')
					.setColor(process.env.EMBED_ERROR_COLOR)
					.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
			)
		}

		message.channel
			.bulkDelete(amount, true)
			.then((messages) =>
				message.channel.send(
					new Discord.MessageEmbed()
						.setTitle(`Deleted ${messages.size} messages`)
						.setColor(process.env.EMBED_ERROR_COLOR)
						.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
				)
			)
			.catch((err) => {
				client.logger.error(err)
				message.channel.send(
					new Discord.MessageEmbed()
						.setTitle('Error!')
						.setDescription(
							'There was an error trying to clear messages in this channel!'
						)
						.setColor(process.env.EMBED_ERROR_COLOR)
						.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
				)
			})
	},
}
