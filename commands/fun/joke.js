const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
	name: 'joke',
	description: 'Sends a random joke.',
	category: 'fun',
	cooldown: 5,
	args: false,
    aliases: [ "funny-joke" ],
	async execute(client, message, args) {
		await axios
			.get(`https://official-joke-api.appspot.com/random_joke`)
			.then((response) => {
				message.channel.send({embed: {
                    title: "Joke",
                    description: `**Setup:** ${response.data.setup}\n**Punchline:** ${response.data.punchline}`,
                    color: process.env.EMBED_COLOR,
                    footer: {
                        icon_url: client.user.avatarURL(),
                        text: process.env.EMBED_FOOTER
                      },
                }});
			})
			.catch(function (error) {
				message.reply('Could not send you a Random Joke :confused:')
			})
	},
}
