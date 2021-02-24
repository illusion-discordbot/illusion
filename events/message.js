const Discord = require('discord.js')
const cooldowns = new Discord.Collection()
const mongoose = require('mongoose')
const Guild = require('../models/guild')
const axios = require('axios')

module.exports = async (client, message) => {
	let prefix
	if (message.channel.type === 'text') {
		let settings = await Guild.findOne({ guildID: message.guild.id })
		if (!settings) {
			const newSettings = new Guild({
				_id: mongoose.Types.ObjectId(),
				guildID: message.guild.id,
				guildName: message.guild.name,
				prefix: '-',
			})
			await newSettings.save().catch(() => {})
			settings = await Guild.findOne({ guildID: message.guild.id })
		}
		prefix = settings.prefix
	}
	if (message.channel.type === 'dm') {
		prefix = '-'
	}

	const contentTypes = [
		'application/json',
		'text/plain',
		'text/yaml',
		'text/javascript',
		'application/javascript',
		'text/x-python',
	]

	if (message.attachments) {
		for (const attachment of message.attachments.values()) {
			const data = await axios.get(attachment.url)
			if (!contentTypes.some((type) => data.headers['content-type'] === type)) continue

			try {
				const haste = await axios.post(
					'https://paste.illusionbot.xyz/documents',
					data.data
				)

				await message.channel.send(
					new Discord.MessageEmbed()
						.setTitle('Pasted!')
						.setURL(`https://paste.illusionbot.xyz/${haste.data.key}`)
						.setDescription(
							`Hi there, It seems you have put a file in the chat, I went ahead and uploaded \`${attachment.name}\` for ya :) Make sure to do this in the future so I don't have too! Click the blue text above to see the paste.`
						)
						.setColor(process.env.EMBED_COLOR)
						.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
				)
			} catch (e) {
				client.logger.error(e)
				await message.channel.send(
					new Discord.MessageEmbed()
						.setTitle('Could not paste :(')
						.setURL('https://paste.illusionbot.xyz/')
						.setDescription(
							'I was having trouble putting your file on hastebin, If you would like to do it manually that would be awesome! You can use a paste service like [this one](https://paste.illusionbot.xyz/) or any other one!'
						)
						.setColor(process.env.EMBED_ERROR_COLOR)
						.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
				)
			}
		}
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return

	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const commandName = args.shift().toLowerCase()

	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
		)

	if (!command) return

	// guildOnly: true/false,
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply(
			new Discord.MessageEmbed()
				.setTitle('I can\'t execute that command inside DMs!')
				.setColor(process.env.EMBED_COLOR)
				.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
		)
	}

	// ownerOnly: true/false,
	if (
		command.category === 'owner' &&
		message.author.id !== process.env.OWNER &&
		message.author.id !== process.env.OWNER2
	) {
		return message.reply(
			new Discord.MessageEmbed()
				.setTitle('You don\'t have permission to run this command')
				.setColor(process.env.EMBED_ERROR_COLOR)
				.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
		)
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author)
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply(
				new Discord.MessageEmbed()
					.setTitle(`You need ${command.permissions} permissions to do this.`)
					.setColor(process.env.EMBED_ERROR_COLOR)
					.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
			)
		}
	}

	if (command.args && !args.length) {
		if (command.usage) {
			return message.reply(
				new Discord.MessageEmbed()
					.setTitle('Missing Args')
					.setDescription(
						`You didn't provide any arguments, ${message.author}!\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
					)
					.setColor(process.env.EMBED_ERROR_COLOR)
					.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
			)
		}

		return message.reply(
			new Discord.MessageEmbed()
				.setTitle('Missing Args')
				.setDescription(`You didn't provide any arguments, ${message.author}!`)
				.setColor(process.env.EMBED_ERROR_COLOR)
				.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
		)
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection())
	}
	const now = Date.now()
	const timestamps = cooldowns.get(command.name)
	const cooldownAmount = (command.cooldown || 3) * 1000

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000
			return message.reply(
				new Discord.MessageEmbed()
					.setTitle('Cooldown')
					.setDescription(
						`${message.author}, please wait ${timeLeft.toFixed(
							1
						)} more second(s) before reusing the \`${command.name}\` command.`
					)
					.setColor(process.env.EMBED_ERROR_COLOR)
					.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
			)
		}
	}

	timestamps.set(message.author.id, now)
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

	try {
		client.logger.cmd(
			`[CMD] ${message.author.tag} (${message.author.id}) ran command ${commandName}`
		)
		command.execute(client, message, args)
	} catch (error) {
		client.logger.error(
			`An error occurred while running ${commandName}: ` + error
		)
		client.logger.debug(`Message: ${message.id}, Args: ${args}`)
		message.reply(
			new Discord.MessageEmbed()
				.setTitle('Unknown Error')
				.setDescription(
					'There was an error trying to execute that command!\nPlease contact us in [Our Discord](https://discord.gg/wjqTBhM)\nBe Prepared to provide the message id, and command'
				)
				.setColor(process.env.EMBED_ERROR_COLOR)
				.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
		)
	}
}
