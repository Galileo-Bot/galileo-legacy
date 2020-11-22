process.chdir(__dirname);
const isCanary = process.argv[2] === '--canary';
module.exports = {isCanary};

const Logger = require('./utils/Logger.js');
const GaliClient = require('./entities/Client.js');
const {tokens} = require('./assets/jsons/config.json');
const client = new GaliClient();
module.exports.client = client;

Logger.error(`Démarrage de Galileo${isCanary ? ' Canary' : ''}...`, 'Starting');
Logger.warn('Chargement des évents.', 'Loading');
client.eventManager.loadEvents('events');

Logger.warn('Chargement des commandes.', 'Loading');
client.commandManager.loadCommands('commands');

client.login(isCanary ? tokens.canary : tokens.prod);
