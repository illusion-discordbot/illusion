const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
	name: 'space',
	description: 'People in Space.',
	category: 'fun',
	cooldown: 5,
	args: false,
    aliases: [ "peopleinspace" ],
	async execute(client, message, args) {
		await axios
			.get(`http://api.open-notify.org/astros.json`)
			.then((response) => {
				message.channel.send({embed: {
                    title: "People in space",
                    description: `There are ${response.data.number} people in space right now.`,
                    color: process.env.EMBED_COLOR,
                    footer: {
                        icon_url: client.user.avatarURL(),
                        text: process.env.EMBED_FOOTER
                      },
                }});
			})
			.catch(function (error) {
				message.reply('Could not find how many people are in space :confused:')
			})
	},
}
