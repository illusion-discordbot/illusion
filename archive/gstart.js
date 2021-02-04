

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
    name: 'gstart',
    description: 'Starts a giveaway!',
    cooldown: 5,
        permissions: 'MANAGE_MESSAGES',
    execute(message, args) {

        if(!args[0]){
            return message.reply(new Discord.MessageEmbed()
                    .setTitle(`Incorrect Usage!`)
                    .setDescription(`Usage: \`gstart <time> <# of winners> <Prize>\` `)
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
        }
            if(!args[1]){
                return message.reply(new Discord.MessageEmbed()
                    .setTitle(`Incorrect Usage!`)
                    .setDescription(`Usage: \`gstart <time> <# of winners> <Prize>\` `)
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
            }
                if(!args[2]){

                    return message.reply(new Discord.MessageEmbed()
                    .setTitle(`Incorrect Usage!`)
                    .setDescription(`Usage: \`gstart <time> <# of winners> <Prize>\` `)
                    .setColor(process.env.EMBED_ERROR_COLOR)
                    .setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
                    )
                }

            

        
        
        else client.giveawaysManager.start(message.channel, {
            time: ms(args[0]),
            prize: args.slice(2).join(' '),
            winnerCount: parseInt(args[1])
        // }).then((gData) => {
        //     console.log(gData); 
        });

    }
}



