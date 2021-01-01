//const remindTime = require("../../informations/remindTimes.json");
const Command = require('../../entities/Command.js');

module.exports = class RetenirCommand extends Command {
	constructor() {
		super({
			aliases: ['rappel', 'remind', 'rmd'],
			description: "Permet d'avoir un rappel de texte dans un temps que vous donnez.",
			name: 'retenir',
			usage: 'retenir <texte> <temps> (exemple : 4h, 5j, 12m)',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		/**
		 * Attention la commande n'est pas refaite
		 */

		/*if (args.length === 0) return super.send(argError("<a:attention:613714368647135245> **Veuillez mettre du [texte] à se souvenir.**", "**3 arguments attendus.**", this));
		 
		 let voyelles = ["a", "e", "i", "o", "u", "y", "ù", "à", "é", "è", "ê", "ô", "î"];
		 let times = ["d", "j", "h", "m", "s"],
		 timeTotal = 0,
		 finalDate = new Date();
		 let time = String(args[args.length - 1].trim());
		 
		 if (!args[args.length - 1].includes(times.some(time => args[args.length - 1] === time))) {
		 args.pop();
		 let thing = args.join(" ");
		 if (Number.isInteger(time)) {
		 return super.send(argError("<a:attention:613714368647135245> **Veuillez mettre une période de temps valide.\nExemples : 4h/2m/8d", "Erreur sur le troisième argument.**", this));
		 }
		 if (time.endsWith('j') || time.endsWith('d') || time.endsWith('jour') || time.endsWith('jours')) {
		 timeTotal = 1000 * 60 * 60 * 24 * parseInt(time.slice(-time.length, -1));
		 finalDate = finalDate.getTime() + timeTotal;
		 remindTime.push({
		 time: finalDate,
		 user: message.author.id,
		 thing: thing
		 });
		 await client.writeJSON("./informations/remindTimes.json", remindTime);
		 
		 if (voyelles.includes(thing[0])) return super.send(`<:BlurpleThumbsUp:613713987456204810> **Vous serez bien averti d'\`${thing}\` dans ${time.slice(-time.length, -1)} jours.**`);
		 else return super.send(`<:BlurpleThumbsUp:613713987456204810> **Vous serez bien averti de \`${thing}\` dans ${time.slice(-time.length, -1)} jours.**`);
		 } else if (time.endsWith('h') || time.endsWith('heure') || time.endsWith('heures')) {
		 timeTotal = 1000 * 60 * 60 * parseInt(time.slice(-time.length, -1));
		 finalDate = finalDate.getTime() + timeTotal;
		 remindTime.push({
		 time: finalDate,
		 user: message.author.id,
		 thing: thing
		 });
		 await client.writeJSON("./informations/remindTimes.json", remindTime);
		 
		 if (voyelles.includes(thing[0])) return super.send(`<:BlurpleThumbsUp:613713987456204810>**Vous serez bien averti d'\`${thing}\` dans ${time.slice(-time.length, -1)} heures.**`);
		 else return super.send(`<:BlurpleThumbsUp:613713987456204810> **Vous serez bien averti de \`${thing}\` dans ${time.slice(-time.length, -1)} heures.**`);
		 } else if (time.endsWith('m') || time.endsWith('minute') || time.endsWith('minutes')) {
		 timeTotal = 1000 * 60 * parseInt(time.slice(-time.length, -1));
		 finalDate = finalDate.getTime() + timeTotal;
		 remindTime.push({
		 time: finalDate,
		 user: message.author.id,
		 thing: thing
		 });
		 await client.writeJSON("./informations/remindTimes.json", remindTime);
		 
		 if (voyelles.includes(thing[0])) return super.send(`<:BlurpleThumbsUp:613713987456204810> **Vous serez bien averti d'\`${thing}\` dans ${time.slice(-time.length, -1)} minutes.**`);
		 else return super.send(`<:BlurpleThumbsUp:613713987456204810> **Vous serez bien averti de \`${thing}\` dans ${time.slice(-time.length, -1)} minutes.**`);
		 } else if (time.endsWith('s') || time.endsWith('seconde') || time.endsWith('secondes')) {
		 timeTotal = 1000 * parseInt(time.slice(-time.length, -1));
		 finalDate = finalDate.getTime() + timeTotal;
		 remindTime.push({
		 time: finalDate,
		 user: message.author.id,
		 thing: thing
		 });
		 await client.writeJSON("./informations/remindTimes.json", remindTime);
		 
		 if (voyelles.includes(thing[0])) return super.send(`<:BlurpleThumbsUp:613713987456204810> **Vous serez bien averti d'\`${thing}\` dans ${time.slice(-time.length, -1)} secondes.**`);
		 else return super.send(`<:BlurpleThumbsUp:613713987456204810> **Vous serez bien averti de \`${thing}\` dans ${time.slice(-time.length, -1)} secondes.**`);
		 } else {
		 return super.send(argError("<a:attention:613714368647135245> **Veuillez mettre une période de temps valide.\nExemples : 4h/2m/8d**", "**Erreur sur le troisième argument.**", this));
		 }
		 } else {
		 return super.send(argError("<a:attention:613714368647135245> **Veuillez mettre une période de temps valide.\nExemples : 4h/2m/8d**", "**Erreur sur le troisième argument.**", this));
		 }*/
		await super.send('Commande en refonte.');
	}
};
