const Discord = require('discord.js')
const client = new Discord.Client()
const { OGSkiesTicket } = require('ogskies_discord_ticket')
const ticket = new OGSkiesTicket()


module.exports = {
    name: 'close',
    description: 'Closes a ticket',
    aliases: ['closeticket', 'ticketclose'],
    cooldown: 5,
         guildOnly: 'true', 

    execute(message, args) {
        const reason = args.join(" ") ? args.join(" ") : "No Reason Provoided"
        ticket.closeTicket(message)



    }


}