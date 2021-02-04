const ms = require('ms');
const Discord = require('discord.js'),
    client = new Discord.Client(),
    settings = { };

const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    updateCountdownEvery: 10000,
    hasGuildMembersIntent: true,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: process.env.EMBED_COLOR,
        reaction: '🎉'
    }
});
client.giveawaysManager = manager;

module.exports = {
    name: 'greroll',
    description: 'Re-Rolls a giveaway!',
    cooldown: 5,
        permissions: 'MANAGE_MESSAGES',
    execute(message, args) {
        if(!args[0]){
            return message.channel.send(':x: You have to specify a valid message ID!');
        }
    
        let giveaway = 
        client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
        client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);
    
        if(!giveaway){
            return message.channel.send('Unable to find a giveaway for `'+ args.join(' ') +'`.');
        }
        client.giveawaysManager.reroll(giveaway.messageID)
        .then(() => {
            message.channel.send('Giveaway rerolled!');
        })
        .catch((e) => {
            if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
                message.channel.send('This giveaway is not ended!');
            } else {
                console.error(e);
                message.channel.send('An error occured...');
            }
        }
        )
    }
}