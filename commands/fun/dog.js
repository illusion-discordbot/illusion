const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
	name: 'dog',
	description: 'Sends a random dog picture and fact.',
	category: 'fun',
	cooldown: 5,
	args: false,
    aliases: [ "dogpic", "dogfact" ],
	async execute(client, message, args) {
		await axios
			.get(`https://some-random-api.ml/img/dog`)
			.then(async (response) => {
                await axios
                .get('https://some-random-api.ml/facts/dog')
                .then((response2) =>  {
				message.channel.send({embed: {
                    description: `**Dog Fact:**\n${response2.data.fact}\n\n**Dog Image:**`,
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
