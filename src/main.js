process.chdir(__dirname);

const Logger = require('./utils/Logger.js');
const GaliClient = require('./entities/Client.js');
const {tokens} = require('./assets/jsons/config.json');
const client = new GaliClient();
const isCanary = process.argv[2] === "--canary";

Logger.error('Démarrage...', 'Starting');
Logger.warn('Chargement des évents.', 'Loading');
client.eventManager.loadEvents('events');

Logger.warn('Chargement des commandes.', 'Loading');
client.commandManager.loadCommands('commands');

client.login(isCanary ? tokens.canary : tokens.prod);

module.exports = {client, isCanary};

/* todo :
 Fixer la commande `citer` qui ne trouve parfois pas les messages.
 Fixer la commande help qui renvoie parfois une erreur.
 Fixer les intents.
 */


