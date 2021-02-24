const mongoose = require('mongoose')
const logger = require('./Logger')

module.exports = {
	init: () => {
		const dbOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
			poolSize: 5,
			connectTimeoutMS: 10000,
			family: 4,
		}

		mongoose.connect(process.env.MONGODB, dbOptions)
		mongoose.set('useFindAndModify', false)
		mongoose.Promise = global.Promise

		mongoose.connection.on('connected', () => {
			logger.log('Mongoose has successfully connected!')
		})

		mongoose.connection.on('err', (err) => {
			logger.error(`Mongoose connection error: \n${err.stack}`)
		})

		mongoose.connection.on('disconnected', () => {
			logger.warn('Mongoose connection lost')
		})
	},
}
