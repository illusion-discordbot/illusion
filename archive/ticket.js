const Discord = require('discord.js')
const client = new Discord.Client()
const { OGSkiesTicket } = require('ogskies_discord_ticket')
const ticket = new OGSkiesTicket()


module.exports = {
    name: 'new',
    description: 'Creates a ticket!',
    aliases: ['ticket', 'createticket'],
    cooldown: 5,
         guildOnly: 'true', 

    execute(message, args) {
        const reason = args.join(" ") ? args.join(" ") : "No Reason Provoided"
        ticket.makeTicket(message, reason)



    }


}