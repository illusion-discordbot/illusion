const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config()

const client = new Discord.Client();
client.logger = require("./modules/Logger");
client.on('warn', m => client.logger.log(`A warn event was sent by Discord.js: \n${JSON.stringify(m)}`, "warn"));
client.on('error', m => client.logger.log(`An error event was sent by Discord.js: \n${JSON.stringify(m)}`, "error"));
process.on("uncaughtException", (err) => {const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");client.logger.error(`Uncaught Exception: ${errorMsg}`);console.error(err);process.exit(1);});
process.on("unhandledRejection", err => {client.logger.error(`Unhandled rejection: ${err}`);console.error(err);});

client.commands = new Discord.Collection();
client.mongoose = require('./modules/mongoose');

let commandLength = 0
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
        commandLength += 1
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}
client.logger.log(`Loading ${commandLength} commands.`);
// Event
fs.readdir('./events/', (err, files) => {
    if (err) return client.logger.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        const evtName = file.split('.')[0];
		client.on(evtName, evt.bind(null, client));
	});
	client.logger.log(`Loading ${files.length} events.`);
});

client.mongoose.init();
client.login(process.env.TOKEN);