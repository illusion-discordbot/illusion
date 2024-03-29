const Discord = require('discord.js')
const clean = (text) => {
	return typeof text === 'string'
		? text
				.replace(/`/g, '`' + String.fromCharCode(8203))
				.replace(/@/g, '@' + String.fromCharCode(8203))
		: text
}
module.exports = {
	name: 'eval',
	description: '',
	category: 'owner',
	args: true,
	execute(client, message, args) {
		if (
			message.author.id !== process.env.OWNER &&
			message.author.id !== process.env.OWNER2
		) {
			return message.reply(
				new Discord.MessageEmbed()
					.setTitle("You don't have permission to run this command")
					.setColor(process.env.EMBED_COLOR)
					.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
			)
		}

		client.logger.log(
			`The eval command was used by ${message.author.username}!`
		)
		try {
			const code = args.join(' ')
			let evaled = eval(code)

			if (typeof evaled !== 'string') {
				evaled = require('util').inspect(evaled)
			}

			message.channel.send(clean(evaled), { code: 'xl' })
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
		}
	},
}
