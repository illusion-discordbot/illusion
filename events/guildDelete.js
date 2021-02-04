const mongoose = require('mongoose');
const Guild = require('../models/guild');
const Discord = require('discord.js');
module.exports = async (client, guild) => {
    if (!guild.available) return;
    client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
    Guild.findOneAndDelete({
        guildID: guild.id
    }, (err, res) => {
        if(err) console.error(err)
    });
};