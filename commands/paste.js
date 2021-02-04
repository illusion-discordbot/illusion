require('dotenv')
const axios = require('axios');
const Discord = require('discord.js');
module.exports = {
	name: 'paste',
	description: 'Upload your message to HasteBin!',
    cooldown: 5,
    args: true,
    usage: '[Message]',
	async execute(client, message, args){
        let text = args.join(" ")
        await axios.post('https://paste.illusionbot.xyz/documents', text)
          .then(function (response) {
            message.channel.send(new Discord.MessageEmbed()
             .setTitle(`Pasted!`)
             .setDescription(`Your message can be found [here](https://paste.illusionbot.xyz/${response.data.key})!`)
             .setColor(process.env.EMBED_COLOR)
             .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
             
    )
    message.delete()
          })
          .catch(function (error) {
            console.log(error);
          });

	},
};