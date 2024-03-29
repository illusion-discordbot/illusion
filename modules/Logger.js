const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs')

exports.log = (content, type = 'log') => {
	const timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`

	switch (type) {
		case 'log': {
			fs.appendFile(
				'log.txt',
				`${timestamp} [${type.toUpperCase()}] ${content}\n`,
				(err) => {
					if (err) {
						console.log(err)
					}
				}
			)
			return console.log(
				`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `
			)
		}
		case 'warn': {
			fs.appendFile(
				'log.txt',
				`${timestamp} [${type.toUpperCase()}] ${content}\n`,
				(err) => {
					if (err) {
						console.log(err)
					}
				}
			)
			return console.log(
				`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `
			)
		}
		case 'error': {
			fs.appendFile(
				'log.txt',
				`${timestamp} [${type.toUpperCase()}] ${content}\n`,
				(err) => {
					if (err) {
						console.log(err)
					}
				}
			)
			return console.log(
				`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `
			)
		}
		case 'debug': {
			fs.appendFile(
				'log.txt',
				`${timestamp} [${type.toUpperCase()}] ${content}\n`,
				(err) => {
					if (err) {
						console.log(err)
					}
				}
			)
			return console.log(
				`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `
			)
		}
		case 'cmd': {
			fs.appendFile(
				'log.txt',
				`${timestamp} [${type.toUpperCase()}] ${content}\n`,
				(err) => {
					if (err) {
						console.log(err)
					}
				}
			)
			return console.log(
				`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`
			)
		}
		case 'ready': {
			fs.appendFile(
				'log.txt',
				`${timestamp} [${type.toUpperCase()}] ${content}\n`,
				(err) => {
					if (err) {
						console.log(err)
					}
				}
			)
			return console.log(
				`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`
			)
		}
		case 'info': {
			fs.appendFile(
				'log.txt',
				`${timestamp} [${type.toUpperCase()}] ${content}\n`,
				(err) => {
					if (err) {
						console.log(err)
					}
				}
			)
			return console.log(
				`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`
			)
		}
		case 'blank': {
			fs.appendFile(
				'log.txt',
				`${timestamp} ${content}\n`,
				(err) => {
					if (err) {
						console.log(err)
					}
				}
			)
			return console.log(
				`${timestamp} ${content}`
			)
		}
		default:
			throw new TypeError(
				'Logger type must be either warn, debug, log, ready, cmd or error.'
			)
	}
}

exports.error = (...args) => this.log(...args, 'error')

exports.warn = (...args) => this.log(...args, 'warn')

exports.debug = (...args) => this.log(...args, 'debug')

exports.cmd = (...args) => this.log(...args, 'cmd')

exports.blank = (...args) => this.log(...args, 'blank')

exports.info = (...args) => this.log(...args, 'info')
