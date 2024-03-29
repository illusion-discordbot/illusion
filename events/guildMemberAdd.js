const Discord = require('discord.js')
const Guild = require('../models/guild')
const Canvas = require('canvas')

module.exports = async (client, member) => {
	const settings = await Guild.findOne(
		{
			guildID: member.guild.id,
		},
		(err, guild) => {
			if (err) client.logger.error(err)
		}
	)
	if (!settings.welcomeChannelID) {
		return true
	}
	// create a new Canvas
	const canvas = Canvas.createCanvas(1772, 633)
	// make it "2D"
	const ctx = canvas.getContext('2d')
	// set the Background to the welcome.png
	const background = await Canvas.loadImage('./welcome.png')
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
	ctx.strokeStyle = '#f2f2f2'
	ctx.strokeRect(0, 0, canvas.width, canvas.height)
	// set the first text string
	const textString3 = `${member.user.username}`
	// if the text is too big then smaller the text
	if (textString3.length >= 14) {
		ctx.font = 'bold 100px Sans'
		ctx.fillStyle = '#f2f2f2'
		ctx.fillText(textString3, 720, canvas.height / 2 + 20)
	}
	// else dont do it
	else {
		ctx.font = 'bold 150px Sans'
		ctx.fillStyle = '#f2f2f2'
		ctx.fillText(textString3, 720, canvas.height / 2 + 20)
	}
	// define the Discriminator Tag
	const textString2 = `#${member.user.discriminator}`
	ctx.font = 'bold 40px Sans'
	ctx.fillStyle = '#f2f2f2'
	ctx.fillText(textString2, 730, canvas.height / 2 + 58)
	// define the Member count
	const textString4 = `Member #${member.guild.memberCount}`
	ctx.font = 'bold 60px Sans'
	ctx.fillStyle = '#f2f2f2'
	ctx.fillText(textString4, 750, canvas.height / 2 + 125)
	// get the Guild Name
	const textString5 = `${member.guild.name}`
	ctx.font = 'bold 60px Sans'
	ctx.fillStyle = '#f2f2f2'
	ctx.fillText(textString5, 700, canvas.height / 2 - 150)
	// create a circular "mask"
	ctx.beginPath()
	ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true) // position of img
	ctx.closePath()
	ctx.clip()
	// define the user avatar
	const avatar = await Canvas.loadImage(
		member.user.displayAvatarURL({ format: 'jpg' })
	)
	// draw the avatar
	ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500)
	// get it as a discord attachment
	const attachment = new Discord.MessageAttachment(
		canvas.toBuffer(),
		'welcome-image.png'
	)
	// define the welcome embed
	const welcomeembed = new Discord.MessageEmbed()
		.setColor(process.env.EMBED_COLOR)
		.setTimestamp()
		.setFooter(process.env.EMBED_FOOTER, process.env.EMBED_FOOTER_IMAGE)
		.setTitle(`**Welcome to ${member.guild.name}!**`)
		//   .setDescription(`**Welcome to ${member.guild.name}!**
		// Hi <@${member.id}>!, read and accept the rules!`)
		.setImage('attachment://welcome-image.png')
		.attachFiles(attachment)
	// send the welcome embed to there
	if (settings.welcomeRoleID) {
		member.roles.add(settings.welcomeRoleID)
	}
	member.guild.channels.cache.get(settings.welcomeChannelID).send(welcomeembed)
}
