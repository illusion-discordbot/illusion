const Guild = require('../models/guild');
module.exports = async (client, guild) => {
    if (!guild.available) return;
    client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
    Guild.findOneAndDelete({
        guildID: guild.id
    }, (err, res) => {
        if(err) client.logger.error(err)
    });
};