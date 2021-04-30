const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
	name: 'chucknorris',
	description: 'Sends a random Chuck Norris joke.',
	category: 'fun',
	cooldown: 5,
	args: false,
    aliases: [ "chuckjoke" ],
	async execute(client, message, args) {
		await axios
			.get(`https://api.chucknorris.io/jokes/random`)
			.then((response) => {
				message.channel.send({embed: {
                    title: "Chuck Norris Joke",
                    description: response.data.value,
                    color: process.env.EMBED_COLOR,
                    footer: {
                        icon_url: client.user.avatarURL(),
                        text: process.env.EMBED_FOOTER
                      },
                }});
			})
			.catch(function (error) {
				message.reply('Could not send you a Chuck Norris Joke :confused:')
			})
	},
}
