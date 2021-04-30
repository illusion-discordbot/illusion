const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
	name: 'cat',
	description: 'Sends a random cat picture and fact.',
	category: 'fun',
	cooldown: 5,
	args: false,
    aliases: [ "catpic", "catfact" ],
	async execute(client, message, args) {
		await axios
			.get(`https://some-random-api.ml/img/cat`)
			.then(async (response) => {
                await axios
                .get('https://some-random-api.ml/facts/Cat')
                .then((response2) =>  {
				message.channel.send({embed: {
                    description: `**Cat Fact:**\n${response2.data.fact}\n\n**Cat Image:**`,
                    color: process.env.EMBED_COLOR,
                    footer: {
                        icon_url: client.user.avatarURL(),
                        text: process.env.EMBED_FOOTER
                      },
                    image: {
                        url: response.data.link,
                    }
                }});
			})
            .catch(function (error) {
				message.reply('Something went wrong :confused:')
			})
        })
			.catch(function (error) {
				message.reply('Something went wrong :confused:')
			})
	},
}
