module.exports = {
	name: 'prefix',
	description: 'Change the bot prefix!',
    cooldown: 5,
    aliases: ['changeprefix'],
    usage: '[new prefix]',
    args: true,
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
	execute(message, args) {
	},
};