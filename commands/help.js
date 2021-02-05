let prefix = '-'
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[help name]',
	cooldown: 5,
	execute(client, message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            
            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply(new Discord.MessageEmbed()
                    .setTitle(`DM Sent!`)
                    .setDescription('I have sent you a DM with my help commands!')
                    .setColor(process.env.EMBED_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(new Discord.MessageEmbed()
                    .setTitle(`Unable to send DM!`)
                    .setDescription('There was an error trying to DM you, Do you have your DMs Locked?')
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
                });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
        

	},
};