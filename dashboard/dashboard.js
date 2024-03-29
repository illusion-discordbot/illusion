// We import modules.
const path = require('path')
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const Strategy = require('passport-discord').Strategy
const ejs = require('ejs')
const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../models/guild')

// We instantiate express app and the session store.
const app = express()
const MemoryStore = require('memorystore')(session)

// We export the dashboard as a function which we call in ready event.
module.exports = async (client) => {
	// We declare absolute paths.
	const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`) // The absolute path of current this directory.
	const templateDir = path.resolve(`${dataDir}${path.sep}templates`) // Absolute path of ./templates directory.

	// Deserializing and serializing users without any additional logic.
	passport.serializeUser((user, done) => done(null, user))
	passport.deserializeUser((obj, done) => done(null, obj))

	// We set the passport to use a new discord strategy, we pass in client id, secret, callback url and the scopes.
	/** Scopes:
	 *  - Identify: Avatar's url, username and discriminator.
	 *  - Guilds: A list of partial guilds.
	 */
	let discordCallbackURL = ''
	if (process.env.DASHBOARD_REVERSE_PROXY === 'true') {
		discordCallbackURL = `${process.env.DASHBOARD_DOMAIN}/callback`
	} else {
		discordCallbackURL = `${process.env.DASHBOARD_DOMAIN}:${process.env.DASHBOARD_PORT}/callback`
	}
	passport.use(
		new Strategy(
			{
				clientID: process.env.DASHBOARD_ID,
				clientSecret: process.env.DASHBOARD_CLIENTSECRET,
				callbackURL: discordCallbackURL,
				scope: ['identify', 'guilds'],
			},
			(accessToken, refreshToken, profile, done) => {
				// eslint-disable-line no-unused-vars
				// On login we pass in profile with no logic.
				process.nextTick(() => done(null, profile))
			}
		)
	)

	// We initialize the memorystore middleware with our express app.
	app.use(
		session({
			store: new MemoryStore({ checkPeriod: 86400000 }),
			secret:
				'#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n',
			resave: false,
			saveUninitialized: false,
		})
	)

	// We initialize passport middleware.
	app.use(passport.initialize())
	app.use(passport.session())

	// We bind the domain.
	app.locals.domain = process.env.DASHBOARD_DOMAIN.split('//')[1]

	// We set out templating engine.
	app.engine('html', ejs.renderFile)
	app.set('view engine', 'html')

	// We initialize body-parser middleware to be able to read forms.
	app.use(express.json())
	app.use(
		express.urlencoded({
			extended: true,
		})
	)
	const assetsDir = path.resolve(`${dataDir}${path.sep}assets`)
	app.use('/assets', express.static(assetsDir))

	app.use((req, res, next) => {
		let discUser
		if (!req.user) {
			discUser = ''
		}
		if (req.user) {
			discUser = `(${req.user.username}#${req.user.discriminator} / ${req.user.id}) `
		}
		client.logger.cmd(
			`[DASHBOARD] ${
				req.headers['cf-connecting-ip'] ||
				req.headers['x-forwarded-for'] ||
				req.socket.remoteAddress
			} ${discUser}made ${req.method} request to ${req.url}.`
		)
		next()
	})

	// We declare a renderTemplate function to make rendering of a template in a route as easy as possible.
	const renderTemplate = (res, req, template, data = {}) => {
		// Default base data which passed to the ejs template by default.
		const baseData = {
			bot: client,
			path: req.path,
			user: req.isAuthenticated() ? req.user : null,
		}
		// We render template using the absolute path of the template and the merged default data with the additional data provided.
		res.render(
			path.resolve(`${templateDir}${path.sep}${template}`),
			Object.assign(baseData, data)
		)
	}

	// We declare a checkAuth function middleware to check if an user is logged in or not, and if not redirect him.
	const checkAuth = (req, res, next) => {
		// If authenticated we forward the request further in the route.
		if (req.isAuthenticated()) return next()
		// If not authenticated, we set the url the user is redirected to into the memory.
		req.session.backURL = req.url
		// We redirect user to login endpoint/route.
		res.redirect('/login')
	}

	// Login endpoint.
	app.get(
		'/login',
		(req, res, next) => {
			// We determine the returning url.
			if (req.session.backURL) {
				req.session.backURL = req.session.backURL // eslint-disable-line no-self-assign
			} else if (req.headers.referer) {
				const parsed = new URL(req.headers.referer)
				if (parsed.hostname === app.locals.domain) {
					req.session.backURL = parsed.path
				}
			} else {
				req.session.backURL = '/'
			}
			// Forward the request to the passport middleware.
			next()
		},
		passport.authenticate('discord')
	)

	// Callback endpoint.
	app.get(
		'/callback',
		passport.authenticate('discord', { failureRedirect: '/' }),
		/* We authenticate the user, if user canceled we redirect him to index. */ (
			req,
			res
		) => {
			// If user had set a returning url, we redirect him there, otherwise we redirect him to index.
			if (req.session.backURL) {
				const url = req.session.backURL
				req.session.backURL = null
				res.redirect(url)
			} else {
				res.redirect('/')
			}
		}
	)

	// Logout endpoint.
	app.get('/logout', function (req, res) {
		// We destroy the session.
		req.session.destroy(() => {
			// We logout the user.
			req.logout()
			// We redirect user to index.
			res.redirect('/')
		})
	})

	// Index endpoint.
	app.get('/', (req, res) => {
		renderTemplate(res, req, 'index.ejs')
	})

	// Dashboard endpoint.
	app.get('/dashboard', checkAuth, (req, res) => {
		renderTemplate(res, req, 'dashboard.ejs', { perms: Discord.Permissions })
	})

	// Settings endpoint.
	app.get('/dashboard/:guildID', checkAuth, async (req, res) => {
		// We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
		const guild = await client.guilds.cache.get(req.params.guildID)
		if (!guild) return res.redirect('/dashboard')
		const member = await guild.members.fetch(req.user.id)
		if (!member) return res.redirect('/dashboard')
		if (!member.permissions.has('MANAGE_GUILD')) {
			return res.redirect('/dashboard')
		}
		// We retrieve the settings stored for this guild.
		let settings = await Guild.findOne({ guildID: guild.id })
		if (!settings) {
			const newSettings = new Guild({
				_id: mongoose.Types.ObjectId(),
				guildID: guild.id,
				guildName: guild.name,
				prefix: '-',
			})
			await newSettings.save().catch(() => {})
			settings = await Guild.findOne({ guildID: guild.id })
		}
		renderTemplate(res, req, 'settings.ejs', {
			guild,
			settings: settings,
			alert: null,
		})
	})

	// Settings endpoint.
	app.post('/dashboard/:guildID', checkAuth, async (req, res) => {
		// We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
		const guild = client.guilds.cache.get(req.params.guildID)
		if (!guild) return res.redirect('/dashboard')
		const member = guild.members.cache.get(req.user.id)
		if (!member) return res.redirect('/dashboard')
		if (!member.permissions.has('MANAGE_GUILD'))
			return res.redirect('/dashboard')
		// We retrive the settings stored for this guild.
		let settings = await Guild.findOne({ guildID: guild.id })
		if (!settings) {
			const newSettings = new Guild({
				_id: mongoose.Types.ObjectId(),
				guildID: guild.id,
				guildName: guild.name,
				prefix: '-',
			})
			await newSettings.save().catch(() => {})
			settings = await Guild.findOne({ guildID: guild.id })
		}

		// We set the prefix of the server settings to the one that was sent in request from the form.
		settings.prefix = req.body.prefix
		settings.logChannelID = req.body.logChannelID
		settings.welcomeChannelID = req.body.welcomeChannelID
		settings.welcomeRoleID = req.body.welcomeRoleID
		settings.suggestionChannelID = req.body.suggestionChannelID
		// We save the settings.
		await settings.save().catch(() => {})

		// We render the template with an alert text which confirms that settings have been saved.
		renderTemplate(res, req, 'settings.ejs', {
			guild,
			settings: settings,
			alert: 'Your settings have been saved.',
		})
	})
	 app.get("*", (req, res) => {
      renderTemplate(res, req, "404.ejs")
    })

	app.listen(process.env.DASHBOARD_PORT, null, null, () =>
		client.logger.log(
			`Dashboard is up and running on port ${process.env.DASHBOARD_PORT}.`
		)
	)
}
