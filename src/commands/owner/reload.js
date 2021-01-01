const Logger = require('../../utils/Logger.js');
const {argTypes, tags} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const Command = require('../../entities/Command.js');
const fs = require('fs');
const {join, sep} = require('path');

module.exports = class ReloadCommand extends Command {
	constructor() {
		super({
			aliases: ['rl'],
			description: "Permet de recharger le code d'une commande, de toutes à la fois ou de tous les évents à la fois.",
			name: 'reload',
			tags: [tags.owner_only],
			usage: 'reload <commande> \nreload all\nreload events',
		});
	}

	static reloadFile(path) {
		delete require.cache[require.resolve(path)];
	}

	reloadCommand(command, client) {
		const path = `../../commands/${command.category}/${command.name}.js`;
		ReloadCommand.reloadFile(path);
		const commandRequired = new (require(path))();
		if (commandRequired.category === 'none') commandRequired.category = command.category;
		client.commandManager.unloadCommand(command);
		client.commandManager.loadCommand(commandRequired);

		return super.send(`La commande **\`${command.name}\`** vient d'être rechargée.`);
	}

	async reloadCommands(client) {
		for (const command of client.commands.values()) {
			const path = `../../commands/${command.category}/${command.name}.js`;
			ReloadCommand.reloadFile(path);
			client.commandManager.unloadCommand(command);
		}
		await client.commandManager.loadCommands('commands');

		return super.send('Toutes les commandes ont bien été rechargées.');
	}

	async reloadDir(dirPath, numberOfFiles) {
		const files = fs.readdirSync(dirPath);

		for (const file of files) {
			const path = join(dirPath, file);
			if (file.endsWith('.js')) {
				if ([`src${sep}events${sep}`].some(p => path.includes(p))) continue;

				ReloadCommand.reloadFile(path);
				numberOfFiles++;
				Logger.log(`Le fichier '${path}' a été rechargé. (${numberOfFiles})`, 'Reloading');
			} else if (fs.statSync(path).isDirectory()) {
				numberOfFiles = await this.reloadDir(path, numberOfFiles);
			}
		}

		return numberOfFiles;
	}

	async reloadEvents(client) {
		const m = await super.send('...');
		for (const event of client.events.values()) {
			const eventPath = `../../events/${event.name}.js`;
			ReloadCommand.reloadFile(eventPath);
			client.eventManager.unbind(event);
		}

		await m.edit('Tous les évènements ont été déchargés.');
		await client.eventManager.loadEvents('events');

		return await m.edit('Tous les évènements ont bien été rechargés.');
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const command = getArg(message, 1, argTypes.command);
		if (!args[0]) return argError(message, this, 'Vous devez mettre une commande à recharger.');

		if (['all', 'al', 'a', 'toutes', 'tout'].includes(args[0])) return await this.reloadCommands(client);

		if (['events', 'évents', 'e'].includes(args[0])) return await this.reloadEvents(client);

		if (['source', 'src'].includes(args[0])) return await this.send(`${await this.reloadDir(process.cwd(), 0)} fichiers rechargés.`);

		const path = args.join(' ');
		if (fs.existsSync(path)) {
			if (fs.statSync(path).isDirectory()) {
				return await this.send(`${await this.reloadDir(join(process.cwd(), path), 0)} fichiers rechargés.`);
			}
			ReloadCommand.reloadFile(join(process.cwd(), path));
			return await this.send(`Fichier \`${path}\` rechargé !`);
		}

		command ? this.reloadCommand(command, client) : argError(message, this, `La commande \`${args[0]}\` n'a pas été trouvée.`);
	}
};
