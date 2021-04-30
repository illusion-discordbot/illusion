const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
	name: 'bird',
	description: 'Sends a random bird picture and fact.',
	category: 'fun',
	cooldown: 5,
	args: false,
    aliases: [ "birdpic", "birdfact" ],
	async execute(client, message, args) {
		await axios
			.get(`https://some-random-api.ml/img/bird`)
			.then(async (response) => {
                await axios
                .get('https://some-random-api.ml/facts/bird')
                .then((response2) =>  {
				message.channel.send({embed: {
                    description: `**Bird Fact:**\n${response2.data.fact}\n\n**Bird Image:**`,
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
