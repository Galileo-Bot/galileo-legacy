const toEmbed = require('godembed');
const Command = require('../../entities/Command.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const {argError} = require('../../utils/Errors.js');
const {isOwner} = require('../../utils/Utils.js');

module.exports = class SayEmbedCommand extends Command {
	constructor() {
		super({
			aliases: ['embedsay', 'edire', 'embdire', 'embeddire', 'esay'],
			description:
				"**Système fait par Ghom.**\nPermet de faire parler le bot avec un embedGenerated qui contient du [texte], une multitude d'options pour personnaliser l'embed sont disponibles.",
			name: 'sayembed',
			usage: `\`\`pf
> Utilisation :

$title Titre de l'embed
$author Auteur
Image de l'auteur
Lien cliquable de l'auteur

$description Description de l'embed
$color Couleur de l'embed (exemple : #ff0000 = rouge)
$image Lien de l'image
$thumbnail Petite image en haut à droite de l'embed

$field Titre du field
Description du field
false|true (s’il est aligné avec les autres ou non)

$footer Texte du footer
Image du footer
$end

La balise 'end' permet de mettre des commentaires entre les balises comme ici.
Faites g/sayembed info pour avoir plus d'infos.

$timestamp Temps de l'embed, 'now' permet de mettre maintenant.\`\`\`

\`sayembed <texte>
sayembed info`,
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		let channel = message.channel;
		if (args.length === 0) return argError(message, this, "Veuillez mettre du texte pour l'embed ! ");

		if (args[0] === 'info') {
			const embed = BetterEmbed.fromTemplate('complete', {
				client,
				description: "> __**Page d'aide complète : https://www.npmjs.com/package/godembed**__",
				title: "Informations supplémentaires sur la génération d'embeds :",
			});
			embed.addField(
				'Variables :',
				`
\`now\` => Date et heure actuelle (pour le \`$timestamp\` uniquement).
\`\${username}\` => Votre nom d'utilisateur.
\`\${userImage}\` => Votre avatar.
\`\${tag}\` => Votre tag.

> **Variables uniquement disponibles sur serveur :**
\`\${guild}\` => Nom du serveur.
\`\${guildImage}\` => Lien de l'image du serveur.
\`\${memberCount}\` => Nombre de membre du serveur.
\`\${nickname}\` => Votre surnom sur le serveur.
`
			);
			embed.addField(
				'Balises supplémentaires :',
				`
\`$end\` => Forcer la fin d'une balise.
\`$and\` => Indiquer qu'il faut passer à l'argument suivant.
\`$blank\` => Texte vide.
\`[Text](lien)\` => Transforme le texte en texte cliquable qui renvoie vers le lien comme [ceci](https://github.com/Ayfri).`
			);

			return super.send(embed);
		}

		if (client.channels.cache.has(args[0]) && isOwner(message.author.id)) {
			args.splice(0, 1);
			channel = client.channels.cache.find(c => c.type === 'text' && c.id === args[0]);
		}

		let text = args
			.join(' ')
			.replace(/\\n/g, '\n')
			.replace(/\${username}/gi, message.author.username)
			.replace(
				/\${userImage}/gi,
				message.author.displayAvatarURL({
					dynamic: true,
					format: 'png',
				})
			)
			.replace(/\${tag}/gi, message.author.tag);

		if (message.guild) {
			text = text
				.replace(/\${nickname}/gi, message.member.nickname)
				.replace(/\${guild}/gi, message.guild.name)
				.replace(
					/\${guildImage}/gi,
					message.guild.iconURL({
						dynamic: true,
						format: 'png',
					})
				)
				.replace(/\${memberCount}/gi, message.guild.memberCount.toString());
		}

		const {embed, errors} = toEmbed(text);
		if (errors.length > 0) await super.send(`\`\`\`js\n${errors.join('\n')}\`\`\``);
		else tryDeleteMessage(message);

		await channel.send({embed});
	}
};
