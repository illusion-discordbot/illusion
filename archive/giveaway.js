const client = require('discord.js');
const { GiveawaysManager } = require('discord-giveaways');
const { Database } = require('quickmongo');
const db = new Database(`mongodb+srv://bot:uRuVboxRgrB0MnXh@illusion-3.at5nz.mongodb.net/Illusion_Data?retryWrites=true&w=majority`);
db.once('ready', async () => {
    if ((await db.get('giveaways')) === null) await db.set('giveaways', []);
});

class GiveawayManagerWithOwnDatabase extends GiveawaysManager {
    // This function is called when the manager needs to get all the giveaway stored in the database.
    async getAllGiveaways() {
        // Get all the giveaway in the database
        return await db.get('giveaways');
    }

    // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
    async saveGiveaway(messageID, giveawayData) {
        // Add the new one
        await db.push('giveaways', giveawayData);
        // Don't forget to return something!
        return true;
    }

    async editGiveaway(messageID, giveawayData) {
        // Gets all the current giveaways
        const giveaways = await db.get('giveaways');
        // Remove the old giveaway from the current giveaways ID
        const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
        // Push the new giveaway to the array
        newGiveawaysArray.push(giveawayData);
        // Save the updated array
        await db.set('giveaways', newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }

    async deleteGiveaway(messageID) {
        // Gets all the current giveaways
        const data = await db.get('giveaways');
        // Remove the giveaway from the array
        const newGiveawaysArray = data.filter((giveaway) => giveaway.messageID !== messageID);
        // Save the updated array
        await db.set('giveaways', newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }
}

const manager = new GiveawaysManager(client, {
    storage: false,
    updateCountdownEvery: 10000,
    hasGuildMembersIntent: true,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: '#FF0000',
        embedFooter: 'Giveaways!',
        reaction: '🎉'
    }
});

client.giveawaysManager = manager;

module.exports = {
	name: 'giveaway',
	description: 'Starts a giveaway',
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MESSAGES',
    guildOnly: true,
    usage: '[user] (reason)',
	execute(client, message, args) {
        client.giveawaysManager.start(message.channel, {
            time: ms(args[0]),
            prize: args.slice(2).join(' '),
            winnerCount: parseInt(args[1])
        

    })
}
}
