require('dotenv').config();
process.chdir(__dirname);
process.env.IS_CANARY = String(process.argv[2] === '--canary');

const {templates} = require('discord.js-better-embed');
templates.author = {
	...templates.basic,
	...templates.color,
	author: {
		iconURL: '${authorURL}',
		name: '${author}',
	},
	description: '${description}',
};

templates.title = {
	...templates.basic,
	...templates.color,
	title: '${title}'
};

const Logger = require('./utils/Logger.js');
const GaliClient = require('./entities/Client.js');
const client = new GaliClient();
require('dayjs/locale/fr');
const dayjs = require('dayjs');
dayjs.locale('fr');

module.exports.client = client;

Logger.error(`Démarrage de Galileo${process.env.IS_CANARY === 'true' ? ' Canary' : ''}...`, 'Starting');
Logger.warn('Chargement des évents.', 'Loading');
client.eventManager.loadEvents('events');

Logger.warn('Chargement des commandes.', 'Loading');
client.commandManager.loadCommands('commands');

client.login(process.env.IS_CANARY === 'true' ? process.env.CANARY_TOKEN : process.env.PROD_TOKEN);
