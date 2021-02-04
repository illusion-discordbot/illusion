const Discord = require('discord.js')
const client = new Discord.Client()
const { OGSkiesTicket } = require('ogskies_discord_ticket')
const ticket = new OGSkiesTicket()


module.exports = {
    name: 'delrole',
    description: 'removes a support role',
    permissions: 'ADMINISTRATOR',
    aliases: ['remove-role', 'roleremove'],
    cooldown: 5,
         guildOnly: 'true', 

    execute(message, args) {
        ticket.DelRole(message, client)


    }


}