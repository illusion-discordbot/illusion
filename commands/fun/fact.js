const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
	name: 'fact',
	description: 'Sends a random fact.',
	category: 'fun',
	cooldown: 5,
	args: false,
    aliases: [ "randomfact", "uselessfact", "funfact" ],
	async execute(client, message, args) {
		await axios
			.get(`https://uselessfacts.jsph.pl/random.json?language=en`)
			.then((response) => {
				message.channel.send({embed: {
                    title: "Random Fact",
                    description: response.data.text,
                    color: process.env.EMBED_COLOR,
                    footer: {
                        icon_url: client.user.avatarURL(),
                        text: process.env.EMBED_FOOTER
                      },
                }});
			})
			.catch(function (error) {
				message.reply('Could not send you a Random Fact :confused:')
			})
	},
}
