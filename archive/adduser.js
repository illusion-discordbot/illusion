const Discord = require('discord.js')
const client = new Discord.Client()
const { OGSkiesTicket } = require('ogskies_discord_ticket')
const ticket = new OGSkiesTicket()


module.exports = {
    name: 'add',
    description: 'adds a user to the ticket',
    aliases: ['adduser', 'addu'],
    cooldown: 5,
         guildOnly: 'true', 

    execute(message, args) {
        ticket.ticketAddUser(message);



    }


}