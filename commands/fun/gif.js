const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
	name: 'gif',
	description: 'Provide a query and I will return a gif!',
	category: 'fun',
	cooldown: 5,
	args: true,
	usage: '[text]',
	async execute(client, message, args) {
		const text = args.join(' ')
		await axios
			.get(`https://api.tenor.com/v1/random?key=${process.env.TenorApiKey}&q=${text}&limit=1`)
			.then((response) => {
				message.channel.send(response.data.results[0].url)
			})
			.catch(function (error) {
				message.reply('Failed to find a gif that matched your query')
			})
	},
}
