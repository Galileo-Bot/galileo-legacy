const Command = require('../../entities/Command.js');


module.exports = class GetIdCommand extends Command {
	constructor() {
		super({
			name: 'getid', description: 'Permet d\'obtenir **votre** identifiant.', alias: ['gi']
		});
	}
	
	async run(client, message, args) {
		super.run(client, message, args);

		
		await super.send('<a:attention:613714368647135245> **Vérifiez vos messages privés !**');
		message.author.createDM().then(channel => channel.send(`<:hey:635159039831048202> **Voici votre ID :** **\`${message.author.id}\` \n<:etiquette:635159045187174410> *Vous pouvez aussi la récupérer manuellement en passant en Mode Développeur.\n\`(Paramètres > Apparence > Mode Développeur sur PC, Paramètres > Comportement > Mode développeur sur Mobile)\`***`)).catch(err => {
			if (err.message.includes('Cannot send messages to this user')) {
				super.send('Vous avez désactivé la permission aux inconnus de vous envoyer des messages privés, réactivez-la pour recevoir le message en privé.');
			}
		});
		
	}
};
