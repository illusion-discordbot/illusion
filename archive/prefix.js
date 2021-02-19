const mongoose = require('mongoose');
const Guild = require('../models/guild');
module.exports = {
	name: 'prefix',
	description: 'Change the bot prefix!',
    cooldown: 5,
    aliases: ['changeprefix'],
    usage: '[new prefix]',
    args: true,
    guildOnly: true,
    permissions: 'MANAGE_GUILD',
	async execute(client, message, args) {
        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) client.logger.error(err)
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: '-'
                })

                newGuild.save()
               // .then(result => console.log(result))
                .catch(err => client.logger.error(err));

                return message.channel.send('This server was not in our database! We have added it, please retype this command.')
            }
        });

        if (args.length < 1) {
            return message.channel.send(`You must specify a prefix to set for this server! Your current server prefix is \`${settings.prefix}\``)
        };

        await settings.updateOne({
            prefix: args[0]
        });

        return message.channel.send(`Your server prefix has been updated to \`${args[0]}\``);
	},
};