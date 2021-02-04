const Discord = require('discord.js')
const client = new Discord.Client()
const { OGSkiesTicket } = require('ogskies_discord_ticket')
const ticket = new OGSkiesTicket()


module.exports = {
    name: 'setrole',
    description: 'Sets the support role for a ticket',
    permissions: 'ADMINISTRATOR',
    aliases: ['support-role', 'roleset'],
    cooldown: 5,
         guildOnly: 'true', 

    execute(message, args) {
        ticket.setRole(message)


    }


}