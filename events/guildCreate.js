const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = async (client, guild) => {
    client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
    guild = new Guild({
        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        guildName: guild.name,
        prefix: '-'
    });

    guild.save()
    //.then(result => )
    .catch(err => console.error(err));
};