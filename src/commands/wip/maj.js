const Command = require('../../entities/Command.js');

module.exports = class MajCommand extends (
	Command
) {
	constructor() {
		super({
			name: 'maj',
			description: "Permet d'avoir des informations sur une mise à jour, la dernière en date, ou d'avoir la liste des mises à jour.",
			usage: 'maj <version>\nmaj liste\nmaj',
			aliases: ['màj'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		/* 	let versions = [];
		 let arg = args.join(' ');
		 Object.keys(update).forEach((version) => {
		 versions.push(version);
		 });
		 versions = versions.sort().reverse();
		 if (arg === 'liste' || !update.hasOwnProperty(arg)) {
		 if (message.guild.me.hasPermissionClient('MANAGE_MESSAGES', true, false, false)) message.delete();
		 let embedGenerated = new RichEmbed();
		 embedGenerated.setTitle('Liste des versions :');
		 embedGenerated.setDescription('Utilisez `màj <version>` pour avoir des informations sur une mise à jour.');
		 embedGenerated.addField('Bêta :', '**' + versions.filter((ver) => ver.startsWith('b')).join('\n') + '**', true);
		 embedGenerated.addField('Alpha :', '**' + versions.filter((ver) => ver.startsWith('a')).join('\n') + '**', true);
		 embedGenerated.addField('Patchs :', '**' + versions.filter((ver) => ver.startsWith('patch')).join('\n') + '**', true);
		 embedGenerated.setColor('#4b5afd');
		 embedGenerated.setFooter(client.user.username, client.user.displayAvatarURL);
		 embedGenerated.setTimestamp();
		 return super.send(embedGenerated);
		 }
		 if (update.hasOwnProperty(arg)) {
		 super.send(`Le contenu de la mise à jour ${arg} vous a été envoyé en **privé** ! :thumbsup:`);
		 return message.author.send(update[arg]);
		 }
		 
		 super.send("Oui mais non :^p"); */
	}
};
