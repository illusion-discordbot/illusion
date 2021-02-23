const Discord = require('discord.js');
module.exports = {
	name: 'shutdown',
  description: 'stops the bot',
  category: 'owner',
	execute(client, message, args) {
    client.logger.log(`The shut down command was used by ${message.author.username}, shutting down now!`)
    message.channel.send(new Discord.MessageEmbed()
    .setTitle(`Shutting down!`)
    .setColor(process.env.EMBED_COLOR)
    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
    )

    setTimeout(() => {

    try {
      let evaled = eval('process.exit()');

      if (typeof evaled !== "string") {
        evaled = require("util").inspect(evaled);
      }

    } catch (err) {
      client.logger.error(err)
    }
  }, 750); 
	},
};