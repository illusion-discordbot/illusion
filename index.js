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

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.logger.log(`Loading ${commandFiles.length} commands.`);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Event
fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
		client.on(evtName, evt.bind(null, client));
	});
	client.logger.log(`Loading ${files.length} events.`);
});


client.mongoose.init();
client.login(process.env.TOKEN);